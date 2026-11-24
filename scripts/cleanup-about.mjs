import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const aboutDir = path.resolve(__dirname, '../src/assets/portfolio/about')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const VIDEO_EXT = new Set(['.mov', '.mp4', '.webm'])

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

const files = await fs.readdir(aboutDir)

/** 1) 原始影片改名為 about-v01.mov … */
const rawVideos = files
  .filter((f) => {
    const ext = path.extname(f).toLowerCase()
    const base = path.basename(f, path.extname(f))
    return VIDEO_EXT.has(ext) && !/^about-v\d+$/i.test(base)
  })
  .sort((a, b) => a.localeCompare(b, 'en'))

let v = 1
for (const file of rawVideos) {
  const ext = path.extname(file).toLowerCase()
  let outName = `about-v${String(v).padStart(2, '0')}${ext}`
  let to = path.join(aboutDir, outName)
  while (await exists(to)) {
    v += 1
    outName = `about-v${String(v).padStart(2, '0')}${ext}`
    to = path.join(aboutDir, outName)
  }
  await fs.rename(path.join(aboutDir, file), to)
  console.log('rename video', file, '->', outName)
  v += 1
}

/** 2) 刪除非 about-* 的原始圖／HEIC／雜訊媒體 */
const after = await fs.readdir(aboutDir)
for (const file of after) {
  const ext = path.extname(file).toLowerCase()
  const base = path.basename(file, path.extname(file))
  const isClean = /^about-\d+$/i.test(base) || /^about-v\d+$/i.test(base)
  if (isClean) continue

  if (IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext) || ext === '.heic' || ext === '.heif') {
    await fs.unlink(path.join(aboutDir, file))
    console.log('remove', file)
  }
}

console.log('about folder cleaned')
