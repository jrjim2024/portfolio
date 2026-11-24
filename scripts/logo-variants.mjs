import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const src = path.join(root, 'assets-source', 'LOOGO.png')
const outDir = path.join(root, 'public', 'images', 'logo')

/** 由白底黑字 logo 產生「指定顏色 + 透明背景」版本（緊裁、置中） */
async function makeVariant(outName, fill) {
  // 1) 先把線稿轉成 alpha（白底→透明、線稿→不透明），並壓掉淡灰雜訊
  //    linear(2.4, -40)：放大對比並把接近白色的底部分壓到 0，避免殘留淡邊影響裁切
  const alpha = await sharp(src)
    .grayscale()
    .negate()
    .linear(2.4, -40)
    .toColourspace('b-w')
    .toBuffer()

  const meta = await sharp(src).metadata()

  // 2) 純色填滿 + alpha → 得到「透明背景線稿」
  const tinted = await sharp({
    create: { width: meta.width, height: meta.height, channels: 3, background: fill },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer()

  // 3) 依透明邊緊裁，再輸出（不放大、保留原始解析度以維持清晰度）
  await sharp(tinted)
    .trim({ threshold: 10 })
    .png()
    .toFile(path.join(outDir, outName))
}

await makeVariant('demi-studio-dark.png', { r: 17, g: 17, b: 17 })
await makeVariant('demi-studio-white.png', { r: 255, g: 255, b: 255 })
console.log('logo variants done')
