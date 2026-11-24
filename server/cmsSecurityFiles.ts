import { randomBytes } from 'node:crypto'
import { appendFile, copyFile, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export function securityFiles(dir: string) {
  const backups = join(dir, 'backups')
  const media = join(dir, 'media')
  const log = join(dir, 'audit.jsonl')
  const validId = /^\d{13}-[a-f0-9]{16}$/
  const validName = /^[a-f0-9]{32}\.webp$/
  return {
    async audit(actor: string, action: string, detail: unknown) {
      await appendFile(log, JSON.stringify({ time: new Date().toISOString(), actor, action, detail }) + '\n', { mode: 0o600 })
    },
    async history() {
      try {
        const data = await readFile(log, 'utf8')
        return data.trim().split('\n').filter(Boolean).slice(-100).reverse().map(line => JSON.parse(line))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
        throw error
      }
    },
    async list() {
      await mkdir(backups, { recursive: true, mode: 0o700 })
      return (await readdir(backups)).filter(id => validId.test(id)).sort().reverse()
        .map(id => ({ id, createdAt: new Date(Number(id.slice(0, 13))).toISOString() }))
    },
    async backup(state: unknown) {
      const id = Date.now() + '-' + randomBytes(8).toString('hex')
      const stage = join(backups, id + '.tmp')
      await mkdir(join(stage, 'media'), { recursive: true, mode: 0o700 })
      const names = (await readdir(media)).filter(name => validName.test(name))
      for (const name of names) await copyFile(join(media, name), join(stage, 'media', name))
      await writeFile(join(stage, 'content.json'), JSON.stringify(state, null, 2), { mode: 0o600 })
      await rename(stage, join(backups, id))
      return id
    },
    async restore(id: unknown) {
      if (typeof id !== 'string' || !validId.test(id) || !(await this.list()).some(item => item.id === id)) return null
      const base = join(backups, id)
      const state = JSON.parse(await readFile(join(base, 'content.json'), 'utf8'))
      for (const name of (await readdir(join(base, 'media'))).filter(name => validName.test(name))) {
        await copyFile(join(base, 'media', name), join(media, name))
      }
      return state
    },
  }
}
