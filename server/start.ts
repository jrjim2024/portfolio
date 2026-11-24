import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { createCms } from './localCms.ts'

const publicOrigin = process.env.DEMI_PUBLIC_ORIGIN ? new URL(process.env.DEMI_PUBLIC_ORIGIN) : undefined
if (publicOrigin && (publicOrigin.protocol !== 'https:' || publicOrigin.href !== publicOrigin.origin + '/')) {
  throw new Error('DEMI_PUBLIC_ORIGIN must be an HTTPS origin without a path.')
}
if (publicOrigin && !process.env.DEMI_DATA_DIR) throw new Error('Set DEMI_DATA_DIR to a persistent mounted directory.')
const dist = resolve('dist')
await stat(resolve(dist, 'index.html'))
const cms = await createCms(resolve(process.env.DEMI_DATA_DIR || '.demi-local'), publicOrigin)
const mime: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2',
}

const server = createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  cms(req, res, () => {
    void (async () => {
      if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return }
      const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
      const filename = resolve(dist, '.' + pathname)
      if ((filename !== dist && !filename.startsWith(dist + sep)) || pathname.split('/').some(segment => segment.startsWith('.'))) {
        res.writeHead(404).end()
        return
      }
      const spa = !extname(pathname)
      if (pathname.startsWith('/api/')) { res.writeHead(404).end(); return }
      if (pathname === '/admin' || new URL(req.url ?? '/', 'http://localhost').searchParams.has('preview')) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow')
      }
      const asset = spa ? resolve(dist, 'index.html') : filename
      const info = await stat(asset)
      if (!info.isFile()) { res.writeHead(404).end(); return }
      res.writeHead(200, {
        'Content-Type': mime[extname(asset)] ?? 'application/octet-stream',
        'Content-Length': info.size,
        'Cache-Control': spa ? 'no-cache' : pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      })
      if (req.method === 'HEAD') res.end()
      else createReadStream(asset).on('error', () => res.destroy()).pipe(res)
    })().catch(() => { if (!res.headersSent) res.writeHead(404); res.end() })
  })
})
const port = Number(process.env.PORT || 5313)
server.listen(port, publicOrigin ? '0.0.0.0' : '127.0.0.1', () => {
  console.log('Demi Studio · ' + (publicOrigin?.origin ?? 'http://127.0.0.1:' + port))
})
