/**
 * 將 portfolio 各分類圖片重新整理為連續編號：
 * slug-01.jpg、slug-02.jpg …
 * about 影片另編為 about-v01.mov …
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../src/assets/portfolio')

const IMAGE_CATEGORIES = ['wedding', 'product', 'branding', 'ad', 'about']
const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov'])

function naturalSort(a, b) {
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' })
}

async function renumber(dir, files, nameForIndex) {
  if (files.length === 0) return 0

  const temps = []
  for (let i = 0; i < files.length; i++) {
    const from = path.join(dir, files[i])
    const ext = path.extname(files[i]).toLowerCase()
    const temp = path.join(dir, `__tmp_${String(i).padStart(3, '0')}${ext}`)
    await fs.rename(from, temp)
    temps.push(temp)
  }

  for (let i = 0; i < temps.length; i++) {
    const ext = path.extname(temps[i]).toLowerCase()
    const finalName = nameForIndex(i, ext)
    await fs.rename(temps[i], path.join(dir, finalName))
  }

  return files.length
}

async function renumberImages(slug) {
  const dir = path.join(root, slug)
  let entries
  try {
    entries = await fs.readdir(dir)
  } catch {
    console.log(`${slug}: missing`)
    return
  }

  const files = entries
    .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()))
    .sort(naturalSort)

  const count = await renumber(dir, files, (i, ext) => {
    const n = String(i + 1).padStart(2, '0')
    return `${slug}-${n}${ext === '.jpeg' ? '.jpg' : ext}`
  })

  console.log(
    count
      ? `${slug}: ${count} images -> ${slug}-01 … ${slug}-${String(count).padStart(2, '0')}`
      : `${slug}: no images`,
  )
}

async function renumberAboutVideos() {
  const dir = path.join(root, 'about')
  let entries
  try {
    entries = await fs.readdir(dir)
  } catch {
    return
  }

  const files = entries
    .filter((f) => VIDEO_EXT.has(path.extname(f).toLowerCase()))
    .sort(naturalSort)

  const count = await renumber(dir, files, (i, ext) => {
    const n = String(i + 1).padStart(2, '0')
    return `about-v${n}${ext}`
  })

  console.log(
    count
      ? `about videos: ${count} -> about-v01 … about-v${String(count).padStart(2, '0')}`
      : 'about videos: none',
  )
}

for (const slug of IMAGE_CATEGORIES) {
  await renumberImages(slug)
}
await renumberAboutVideos()
console.log('done')
