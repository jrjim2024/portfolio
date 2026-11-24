import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(__dirname, '../src/assets/portfolio/about')
const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])

const files = (await fs.readdir(dir))
  .filter((f) => {
    const ext = path.extname(f).toLowerCase()
    const base = path.basename(f, path.extname(f))
    // 略過已處理過的 about-XX.jpg，避免重複處理自己
    return IMG_EXT.has(ext) && !/^about-\d+$/i.test(base)
  })
  .sort((a, b) => a.localeCompare(b, 'en'))

console.log('image files:', files.length)

const result = []
let n = 1
for (const file of files) {
  const outName = `about-${String(n).padStart(2, '0')}.jpg`
  const outPath = path.join(dir, outName)
  try {
    await sharp(path.join(dir, file))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(outPath)
    result.push(`/images/portfolio/about/${outName}`)
    console.log('ok', file, '->', outName)
    n++
  } catch (e) {
    console.error('fail', file, e.message)
  }
}

console.log('DONE', result.length)
