import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { createCms } from './server/localCms'
import { join } from 'node:path'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue(), tailwindcss(), {
    name: 'demi-cms',
    async configureServer(server) {
      server.middlewares.use(await createCms(join(root, '.demi-local')))
    },
  }],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Avoid colliding with Commerce Admin (5173) / Widget (5174) / Storefront (5175)
    port: 5180,
    strictPort: true,
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.demi-local/**'] },
  },
})
