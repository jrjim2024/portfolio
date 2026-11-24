import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logo = path.join(root, 'public', 'images', 'logo', 'demi-studio-white.png')

const W = 1200
const H = 630

const LOGO_W = 440
const logoBuf = await sharp(logo)
  .resize({ width: LOGO_W, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer()

const tagline = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
     <text x="50%" y="150" text-anchor="middle"
       font-family="Georgia, 'Times New Roman', serif"
       font-size="28" letter-spacing="8" fill="#b08a5a">
       MODERN EDITORIAL PHOTOGRAPHY
     </text>
   </svg>`,
)

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 17, g: 17, b: 17 } },
})
  .composite([
    { input: logoBuf, top: 185, left: Math.round((W - LOGO_W) / 2) },
    { input: tagline, top: 0, left: 0 },
  ])
  .jpeg({ quality: 88 })
  .toFile(path.join(root, 'public', 'og-image.jpg'))

console.log('og-image done')
