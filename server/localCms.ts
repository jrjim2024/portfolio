import { randomBytes } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'

import sharp from 'sharp'
import { AccountError, openAccounts } from './cmsAccounts.ts'
import { newTotpSecret } from './cmsMfa.ts'
import { securityFiles } from './cmsSecurityFiles.ts'
import type { Access } from '../src/content/cmsAccess.ts'

const prefix = '/api/local-cms/'
const cookie = 'demi_local_session'
const ttl = 8 * 60 * 60 * 1000

class HttpError extends Error {
  readonly status: number; constructor(status: number, message: string) { super(message); this.status = status }
}

async function body(req: IncomingMessage, limit: number) {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw new HttpError(413, '檔案或內容超過大小限制。')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

function json(res: ServerResponse, status: number, value: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(value))
}

async function readFields(req: IncomingMessage): Promise<Record<string, unknown>> {
  const raw = await body(req, 8192)
  try {
    const value = JSON.parse(raw.toString())
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error()
    return value
  } catch { throw new HttpError(400, '輸入格式錯誤。') }
}

export async function createCms(dir: string, publicOrigin?: URL) {
  const media = join(dir, 'media')
  const statePath = join(dir, 'content.json')
  type Content = Record<string, unknown>
  type State = { draft: Content | null; published: Content | null; previous: Content | null; publishedAt: string | null; revision: number }
  const empty: State = { draft: null, published: null, previous: null, publishedAt: null, revision: 0 }
  const sessions = new Map<string, { username: string; expiry: number }>()
  const challenges = new Map<string, { username: string; expiry: number; attempts: number; enrollmentKey?: string; verifying?: boolean }>()
  const files = securityFiles(dir)
  await mkdir(media, { recursive: true })
  const accounts = await openAccounts(dir)
  let blockedUntil = 0
  let failures = 0
  let writes = Promise.resolve()
  const readState = async (): Promise<State> => {
    try { return { ...empty, ...JSON.parse(await readFile(statePath, 'utf8')) } as State }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return empty
      throw error
    }
  }
  function update(change: (state: State) => State | Promise<State>, revision?: unknown) {
    const task = writes.then(async () => {
      const current = await readState()
      if (revision !== current.revision) throw new HttpError(409, '內容已被其他人更新。你的編輯仍保留，請先複製需要的內容，再載入最新版。')
      const result = { ...await change(current), revision: current.revision + 1 }
      const pending = statePath + '.tmp'
      await writeFile(pending, JSON.stringify(result, null, 2), { mode: 0o600 })
      await rename(pending, statePath)
      return result
    })
    writes = task.then(() => {}, () => {})
    return task
  }
  const sessionCookie = (value: string, seconds: number) =>
    cookie + '=' + value + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + seconds + (publicOrigin ? '; Secure' : '')

  function establishSession(res: ServerResponse, username: string) {
    for (const [key, entry] of sessions) if (entry.expiry <= Date.now()) sessions.delete(key)
    const id = randomBytes(32).toString('hex')
    sessions.set(id, { username, expiry: Date.now() + ttl })
    res.setHeader('Set-Cookie', sessionCookie(id, ttl / 1000))
  }

  async function handle(req: IncomingMessage, res: ServerResponse, action: string) {
    if (!publicOrigin && !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '')) {
      throw new HttpError(403, '請從本機開啟。')
    }
    const host = req.headers.host ?? ''
    if (publicOrigin ? host !== publicOrigin.host : !/^(127\.0\.0\.1|localhost|\[::1\])(?::\d+)?$/.test(host)) throw new HttpError(403, '請使用本機網址。')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    const get = req.method === 'GET'
    if (!get && (req.method !== 'POST' || req.headers['x-demi-cms'] !== '1' ||
      (req.headers.origin && req.headers.origin !== (publicOrigin?.origin ?? 'http://' + host)))) throw new HttpError(403, '請求來源不符。')
    const token = (req.headers.cookie ?? '').split('; ').find(entry => entry.startsWith(cookie + '='))?.split('=')[1] ?? ''
    const session = sessions.get(token)
    const actor = session && session.expiry > Date.now() ? accounts.find(session.username) : undefined
    if (get && action === 'published') return json(res, 200, { content: (await readState()).published })
    if (get && /^media\/[a-f0-9]{32}\.webp$/.test(action)) {
      if (!actor?.access.some(key => key === 'preview' || key === 'edit' || key === 'upload') &&
        !JSON.stringify((await readState()).published).includes(prefix + action)) {
        throw new HttpError(404, '圖片不存在。')
      }
      let image
      try { image = await readFile(join(media, action.slice(6))) }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new HttpError(404, '圖片不存在。')
        throw error
      }
      res.writeHead(200, { 'Content-Type': 'image/webp', 'Cache-Control': 'private, max-age=86400' })
      return res.end(image)
    }
    if (!get && action === 'login') {
      if (Date.now() < blockedUntil) throw new HttpError(429, '嘗試次數過多，請稍後再試。')
      const submitted = await readFields(req)
      const account = accounts.login(submitted.username, submitted.password)
      if (!account) {
        if (++failures >= 5) { failures = 0; blockedUntil = Date.now() + 60_000 }
        throw new HttpError(401, '帳號或密碼錯誤。')
      }
      failures = 0
      if (account.role === 'admin') {
        for (const [key, entry] of challenges) if (entry.expiry <= Date.now() || entry.username === account.username) challenges.delete(key)
        const challenge = randomBytes(32).toString('hex')
        const enrollmentKey = accounts.hasMfa(account.username) ? undefined : newTotpSecret()
        challenges.set(challenge, { username: account.username, enrollmentKey, expiry: Date.now() + 300_000, attempts: 0 })
        return json(res, 200, { challenge, enrollmentKey })
      }
      establishSession(res, account.username)
      return json(res, 200, { ok: true })
    }
    if (!get && action === 'mfa') {
      const { challenge, code } = await readFields(req)
      const id = typeof challenge === 'string' ? challenge : ''
      const pending = challenges.get(id)
      if (!pending || pending.expiry <= Date.now() || pending.attempts >= 5 || pending.verifying) {
        throw new HttpError(401, '驗證已失效，請重新登入。')
      }
      pending.attempts++
      pending.verifying = true
      try {
        const codes = await accounts.confirmMfa(pending.username, code, pending.enrollmentKey)
        challenges.delete(id)
        establishSession(res, pending.username)
        return json(res, 200, { ok: true, recoveryCodes: codes })
      } finally { pending.verifying = false }
    }
    if (!actor) throw new HttpError(401, '請先登入後台。')
    const requireAccess = (key: Access) => {
      if (!actor.access.includes(key)) throw new HttpError(403, '你的帳號沒有此操作權限。')
    }
    const visibleState = (state: State) => actor.access.includes('preview') || actor.access.includes('edit')
      ? { ...state, canPublishDraft: Boolean(state.draft), canRestore: Boolean(state.previous) }
      : { draft: null, published: null, previous: null, publishedAt: state.publishedAt,
          revision: state.revision, canPublishDraft: Boolean(state.draft), canRestore: Boolean(state.previous) }
    if (get && action === 'me') return json(res, 200, actor)
    if (get && action === 'accounts') {
      if (actor.role === 'employee') throw new HttpError(403, '你的帳號沒有帳號管理權限。')
      return json(res, 200, accounts.list(actor))
    }
    if (!get && action === 'accounts') {
      const fields = await readFields(req)
      const change = await accounts.save(actor.username, fields)
      if (fields.password || fields.enabled !== true) {
        for (const [key, entry] of sessions) if (entry.username === change.after.username) sessions.delete(key)
      }
      await files.audit(actor.username, 'accounts.change', change)
      return json(res, 200, accounts.list(actor))
    }
    if (['audit', 'backups', 'backup', 'backup-restore'].includes(action)) {
      if (actor.role !== 'admin') throw new HttpError(403, '只有管理員可以查閱紀錄或管理備份。')
      if (get && action === 'audit') return json(res, 200, await files.history())
      if (get && action === 'backups') return json(res, 200, await files.list())
      if (!get && action === 'backup') {
        const id = await files.backup(await readState())
        await files.audit(actor.username, 'backup.create', { id })
        return json(res, 200, await files.list())
      }
      if (!get && action === 'backup-restore') {
        const { id, revision } = await readFields(req)
        const updated = await update(async current => {
          const restored = await files.restore(id) as State | null
          if (!restored) throw new HttpError(404, '找不到這份備份。')
          await files.backup(current)
          return restored
        }, revision)
        await files.audit(actor.username, 'backup.restore', { id, revision: updated.revision })
        return json(res, 200, visibleState(updated))
      }
    }
    if (!get && action === 'password') {
      const fields = await readFields(req)
      await accounts.changePassword(actor.username, fields.currentPassword, fields.nextPassword)
      for (const [key, entry] of sessions) if (entry.username === actor.username && key !== token) sessions.delete(key)
      for (const [key, entry] of challenges) if (entry.username === actor.username) challenges.delete(key)
      return json(res, 200, { ok: true })
    }
    if (get && action === 'state') return json(res, 200, visibleState(await readState()))
    if (get && action === 'preview') {
      requireAccess('preview')
      const state = await readState()
      return json(res, 200, { content: state.draft ?? state.published })
    }
    if (!get && action === 'logout') {
      sessions.delete(token)
      res.setHeader('Set-Cookie', sessionCookie('', 0))
      return json(res, 200, { ok: true })
    }
    if (!get && action === 'upload') {
      requireAccess('upload')
      const raw = await body(req, 12 * 1024 * 1024)
      let image: Buffer
      try {
        const source = sharp(raw, { limitInputPixels: 40_000_000 })
        const { format } = await source.metadata()
        if (!format || !['jpeg', 'png', 'webp'].includes(format)) throw new Error()
        image = await source.rotate().resize({ width: 2200, height: 2200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 87 }).toBuffer()
      } catch { throw new HttpError(400, '請選擇有效的 JPG、PNG 或 WebP 圖片。') }
      const name = randomBytes(16).toString('hex') + '.webp'
      await writeFile(join(media, name), image, { flag: 'wx' })
      return json(res, 200, { url: prefix + 'media/' + name })
    }
    if (!get && action === 'draft') {
      requireAccess('edit')
      let content: Content
      let revision: unknown
      try {
        const payload = JSON.parse((await body(req, 1024 * 1024)).toString())
        content = payload.content
        revision = payload.revision
        if (!content || Array.isArray(content) || typeof content !== 'object') throw new Error()
      } catch (error) {
        if (error instanceof HttpError) throw error
        throw new HttpError(400, '內容格式錯誤。')
      }
      return json(res, 200, visibleState(await update(state => ({ ...state, draft: content }), revision)))
    }
    if (!get && action === 'publish') {
      requireAccess('publish')
      const { revision } = await readFields(req)
      const updated = await update(state => {
        if (!state.draft) throw new HttpError(409, '請先儲存草稿。')
        return { ...state, previous: state.published ?? {}, published: state.draft, publishedAt: new Date().toISOString() }
      }, revision)
      await files.audit(actor.username, 'content.publish', { revision: updated.revision })
      return json(res, 200, visibleState(updated))
    }
    if (!get && action === 'restore') {
      requireAccess('restore')
      const { revision } = await readFields(req)
      const updated = await update(state => {
        if (!state.previous) throw new HttpError(409, '目前沒有可回復的版本。')
        return { ...state, previous: state.published, published: state.previous, publishedAt: new Date().toISOString() }
      }, revision)
      await files.audit(actor.username, 'content.rollback', { revision: updated.revision })
      return json(res, 200, visibleState(updated))
    }
    throw new HttpError(404, '找不到此操作。')
  }
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0] ?? ''
    if (!url.startsWith(prefix)) return next()
    void handle(req, res, url.slice(prefix.length)).catch(error => {
      if (res.writableEnded || res.destroyed) return
      if (error instanceof HttpError || error instanceof AccountError) json(res, error.status, { error: error.message })
      else {
        console.error(error)
        json(res, 500, { error: '內容儲存發生錯誤。' })
      }
    })
  }
}
