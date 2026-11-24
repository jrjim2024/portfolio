import { createHmac, createHash, randomBytes, timingSafeEqual } from 'node:crypto'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
export function newTotpSecret() {
  const bits = [...randomBytes(20)].map(n => n.toString(2).padStart(8, '0')).join('')
  return bits.match(/.{5}/g)!.map(chunk => alphabet[parseInt(chunk, 2)]).join('')
}
export function totp(secret: string, step: number) {
  const bits = [...secret].map(ch => alphabet.indexOf(ch).toString(2).padStart(5, '0')).join('')
  const key = Buffer.from(bits.match(/.{8}/g)!.map(chunk => parseInt(chunk, 2)))
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(step))
  const digest = createHmac('sha1', key).update(counter).digest()
  const value = digest.readUInt32BE(digest[19] & 15) & 0x7fffffff
  return String(value % 1_000_000).padStart(6, '0')
}
export function verifyTotp(secret: string, code: unknown, previous = -1) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) return null
  const now = Math.floor(Date.now() / 30_000)
  return [now, now - 1, now + 1].find(step =>
    step > previous && timingSafeEqual(Buffer.from(totp(secret, step)), Buffer.from(code)),
  ) ?? null
}
export const recoveryHash = (code: string) => createHash('sha256').update(code.trim().toLowerCase()).digest('hex')
export const recoveryCodes = () => Array.from({ length: 8 }, () => randomBytes(10).toString('hex'))
