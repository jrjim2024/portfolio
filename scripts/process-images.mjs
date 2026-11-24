import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sourceDir = path.join(root, 'assets-source')
const imagesDir = path.join(root, 'public', 'images')
const outRoot = path.join(root, 'src', 'assets', 'portfolio')

/** 來源資料夾（中文）→ 輸出分類（英文 slug） */
const categories = {
  婚禮婚紗: 'wedding',
  商品攝影: 'product',
  商業形象照: 'branding',
  商業廣告: 'ad',
}

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MAX_W = 1600
const QUALITY = 80

async function processCategory(srcName, slug) {
  const srcDir = path.join(sourceDir, srcName)
  const outDir = path.join(outRoot, slug)
  await fs.mkdir(outDir, { recursive: true })

  let files
  try {
    files = (await fs.readdir(srcDir)).filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()))
  } catch {
    console.error(`!! 找不到資料夾：${srcDir}`)
    return []
  }
  files.sort((a, b) => a.localeCompare(b, 'zh-Hant'))

  const result = []
  let n = 1
  for (const file of files) {
    const outName = `${slug}-${String(n).padStart(2, '0')}.jpg`
    const outPath = path.join(outDir, outName)
    try {
      await sharp(path.join(srcDir, file))
        .rotate()
        .resize({ width: MAX_W, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outPath)
      result.push(`src/assets/portfolio/${slug}/${outName}`)
      n++
    } catch (e) {
      console.error(`!! 處理失敗 ${file}: ${e.message}`)
    }
  }
  return result
}

async function processLogo() {
  const src = path.join(sourceDir, 'LOOGO.png')
  const outDir = path.join(imagesDir, 'logo')
  await fs.mkdir(outDir, { recursive: true })
  const out = path.join(outDir, 'demi-studio.png')
  try {
    await sharp(src)
      .trim()
      .resize({ width: 640, withoutEnlargement: true })
      .png({ quality: 90 })
      .toFile(out)
    return '/images/logo/demi-studio.png'
  } catch (e) {
    console.error(`!! Logo 處理失敗: ${e.message}`)
    return null
  }
}

const manifest = {}
for (const [srcName, slug] of Object.entries(categories)) {
  manifest[slug] = await processCategory(srcName, slug)
}
manifest.logo = await processLogo()

console.log('=== MANIFEST_START ===')
console.log(JSON.stringify(manifest, null, 2))
console.log('=== MANIFEST_END ===')
