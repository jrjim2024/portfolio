import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { readFile, writeFile, rename, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { accessKeys, canManage, roleLabels, type Account, type Access, type Role } from '../src/content/cmsAccess.ts'

import { recoveryCodes, recoveryHash, verifyTotp } from './cmsMfa.ts'

type Stored = Account & { secret: string; mfa?: { key: string; step: number; recovery: string[] } }
const usernamePattern = /^[a-z0-9][a-z0-9_.-]{2,31}$/
const normalized = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : ''
const show = ({ username, role, access, enabled }: Stored): Account => ({ username, role, access, enabled })
const hash = (password: string) => {
  const salt = randomBytes(16).toString('hex')
  return salt + ':' + scryptSync(password, salt, 64).toString('hex')
}
export class AccountError extends Error {
  readonly status: number; constructor(status: number, message: string) { super(message); this.status = status }
}

export async function openAccounts(dir: string) {
  const file = join(dir, 'accounts.json')
  const bootstrap = join(dir, 'admin-password.txt')
  let accounts: Stored[]
  try { accounts = JSON.parse(await readFile(file, 'utf8')) as Stored[] }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    try { await writeFile(bootstrap, randomBytes(15).toString('base64url'), { flag: 'wx', mode: 0o600 }) }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error }
    const password = (await readFile(bootstrap, 'utf8')).trim()
    if (!password) throw new Error('本機管理者初始密碼為空。')
    accounts = [{ username: 'admin', role: 'admin', access: [...accessKeys], enabled: true, secret: hash(password) }]
    await writeFile(file, JSON.stringify(accounts, null, 2), { flag: 'wx', mode: 0o600 })
  }

  let writes = Promise.resolve()
  function update(change: (current: Stored[]) => Stored[]) {
    const task = writes.then(async () => {
      const next = change(accounts)
      const pending = file + '.tmp'
      await writeFile(pending, JSON.stringify(next, null, 2), { mode: 0o600 })
      await rename(pending, file)
      accounts = next
    })
    writes = task.then(() => {}, () => {})
    return task
  }
  function get(username: string) { return accounts.find(account => account.username === username && account.enabled) }
  function matches(account: Stored | undefined, password: unknown) {
    if (typeof password !== 'string' || (account?.role !== 'admin' && password.length > 128)) return false
    const [salt, key] = (account ?? accounts[0]).secret.split(':')
    return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(key, 'hex')) && Boolean(account)
  }
  function newSecret(password: unknown) {
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
      throw new AccountError(400, '密碼須為 12 至 128 個字元。')
    }
    return hash(password)
  }

  return {
    find(username: string) { const account = get(username); return account && show(account) },
    login(username: unknown, password: unknown) {
      const account = get(normalized(username))
      return matches(account, password) && account ? show(account) : undefined
    },
    hasMfa(username: string) { return Boolean(get(username)?.mfa) },
    async confirmMfa(username: string, code: unknown, enrollmentKey?: string) {
      let codes: string[] | undefined
      await update(current => {
        const account = get(username)
        if (account?.role !== 'admin') throw new AccountError(401, '驗證已失效。')
        const existing = account.mfa
        if (Boolean(existing) === Boolean(enrollmentKey)) throw new AccountError(409, '驗證狀態已變更，請重新登入。')
        const key = existing?.key ?? enrollmentKey!
        const step = verifyTotp(key, code, existing?.step)
        const recovery = typeof code === 'string' && /^[a-fA-F0-9]{20}$/.test(code.trim()) ? recoveryHash(code) : ''
        if (step === null && !existing?.recovery.includes(recovery)) throw new AccountError(401, '驗證碼錯誤、已使用或已過期。')
        if (!existing) codes = recoveryCodes()
        const mfa = {
          key, step: step ?? existing!.step,
          recovery: codes ? codes.map(recoveryHash) : existing!.recovery.filter(item => item !== recovery),
        }
        return current.map(item => item === account ? { ...item, mfa } : item)
      })
      if (codes) await rm(bootstrap, { force: true })
      return codes
    },
    list(actor: Account) { return accounts.filter(account => canManage(actor.role, account.role)).map(show) },
    async save(username: string, raw: Record<string, unknown>) {
      const target = normalized(raw.username)
      let change: { before: Account | null; after: Account; passwordReset: boolean } | undefined
      await update(current => {
        const actor = get(username)
        if (!actor) throw new AccountError(401, '請先登入後台。')
        const existing = current.find(account => account.username === target)
        const role = raw.role as Role
        if (!Object.hasOwn(roleLabels, role) || !canManage(actor.role, role) ||
          (existing && (!canManage(actor.role, existing.role) || role !== existing.role))) {
          throw new AccountError(403, '無權管理此帳號或角色。')
        }
        if (!usernamePattern.test(target)) throw new AccountError(400, '帳號需為 3 至 32 個英數字元，可用點、底線或連字號。')
        if (Boolean(raw.create) === Boolean(existing)) throw new AccountError(409, existing ? '帳號已存在。' : '找不到帳號。')
        if (role === 'owner' && current.some(account => account.role === 'owner' && account.username !== target)) {
          throw new AccountError(409, '老闆帳號只能有一個。')
        }
        if (!Array.isArray(raw.access) || raw.access.some(key => !accessKeys.includes(key))) throw new AccountError(400, '操作權限格式錯誤。')
        const access = new Set(raw.access as Access[])
        for (const key of accessKeys) {
          if (!actor.access.includes(key) && access.has(key) !== Boolean(existing?.access.includes(key))) {
            throw new AccountError(403, '只能調整自己擁有的操作權限。')
          }
        }
        const enabled = raw.enabled === true
        if (existing && raw.password && existing.access.some(key => !actor.access.includes(key))) {
          throw new AccountError(403, '此帳號具有你未持有的操作權限，請由管理者重設密碼。')
        }
        const secret = !existing || raw.password ? newSecret(raw.password) : existing.secret
        const saved = { username: target, role, access: [...access], enabled, secret }
        change = { before: existing ? show(existing) : null, after: show(saved), passwordReset: Boolean(existing && raw.password) }
        return existing ? current.map(account => account === existing ? saved : account) : [...current, saved]
      })
      return change!
    },
    async changePassword(username: string, currentPassword: unknown, nextPassword: unknown) {
      await update(current => {
        const account = get(username)
        if (!matches(account, currentPassword)) throw new AccountError(401, '目前密碼錯誤。')
        if (typeof nextPassword !== 'string' || !nextPassword) throw new AccountError(400, '請輸入新密碼。')
        const secret = account?.role === 'admin' ? hash(nextPassword) : newSecret(nextPassword)
        return current.map(entry => entry === account ? { ...entry, secret } : entry)
      })
    },
  }
}
