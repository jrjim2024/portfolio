/**
 * 建置結束後依 seoMeta 產生 sitemap.xml 到 dist（並同步 public）。
 * 網域預設 https://demi-studio.vercel.app，可透過 VITE_SITE_URL 覆寫。
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const SITE_URL = (process.env.VITE_SITE_URL || 'https://demi-studio.vercel.app').replace(/\/$/, '')

const entries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/wedding', changefreq: 'weekly', priority: '0.9' },
  { path: '/commercial', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
]

const lastmod = new Date().toISOString().slice(0, 10)

const body = entries
  .map((e) => {
    const loc = e.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${e.path}`
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

const targets = [path.join(root, 'public', 'sitemap.xml'), path.join(root, 'dist', 'sitemap.xml')]

for (const file of targets) {
  try {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, xml, 'utf8')
    console.log(`sitemap -> ${path.relative(root, file)}`)
  } catch (err) {
    // dist 可能尚不存在（單獨跑腳本且未 build）
    if (file.includes(`${path.sep}dist${path.sep}`)) {
      console.warn(`skip ${path.relative(root, file)}: ${err instanceof Error ? err.message : err}`)
    } else {
      throw err
    }
  }
}
