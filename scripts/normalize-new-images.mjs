/**
 * 將 portfolio 各分類中「尚未符合 slug-XX.jpg」的新圖，
 * 壓縮並重新命名為接續編號（如 wedding-21.jpg）。
 */
import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../src/assets/portfolio')

const CATEGORIES = ['wedding', 'product', 'branding', 'ad', 'about']
const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])
const MAX_W = 1600
const QUALITY = 80

function isCanonical(file, slug) {
  const base = path.basename(file, path.extname(file))
  // wedding-01 / about-v01 皆算已命名
  return new RegExp(`^${slug}(-v)?-\\d+$`, 'i').test(base)
}

function nextIndex(files, slug) {
  let max = 0
  for (const f of files) {
    const m = path.basename(f, path.extname(f)).match(new RegExp(`^${slug}-(\\d+)$`, 'i'))
    if (m) max = Math.max(max, Number(m[1]))
  }
  return max + 1
}

for (const slug of CATEGORIES) {
  const dir = path.join(root, slug)
  let files
  try {
    files = await fs.readdir(dir)
  } catch {
    continue
  }

  const pending = files
    .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()) && !isCanonical(f, slug))
    .sort((a, b) => a.localeCompare(b, 'zh-Hant'))

  if (pending.length === 0) {
    console.log(`${slug}: no new images`)
    continue
  }

  let n = nextIndex(files, slug)
  for (const file of pending) {
    const outName = `${slug}-${String(n).padStart(2, '0')}.jpg`
    const outPath = path.join(dir, outName)
    const srcPath = path.join(dir, file)
    try {
      await sharp(srcPath)
        .rotate()
        .resize({ width: MAX_W, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outPath)
      await fs.unlink(srcPath)
      console.log(`${slug}: ${file} -> ${outName}`)
      n++
    } catch (e) {
      console.error(`${slug}: fail ${file}: ${e.message}`)
    }
  }
}

console.log('done')
