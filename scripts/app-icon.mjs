import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logo = path.join(root, 'public', 'images', 'logo', 'demi-studio-white.png')

async function makeIcon(size, out) {
  const inner = Math.round(size * 0.74)
  const logoBuf = await sharp(logo)
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 17, g: 17, b: 17, alpha: 1 } },
  })
    .composite([{ input: logoBuf, gravity: 'center' }])
    .png()
    .toFile(path.join(root, 'public', out))
}

await makeIcon(180, 'apple-touch-icon.png')
console.log('app icon done')
