import { defineStore } from 'pinia'

/**
 * 預留用 Content Store（V1 尚未啟用）
 *
 * 目前所有內容皆由 `src/content/*` 的靜態 TypeScript 提供，元件直接引用。
 * 未來資料來源演進路線：
 *
 *   Static Content  →  API  →  CMS  →  Database
 *
 * 屆時只需在此 store 內把 `load()` 改為對應的 fetch 實作，
 * 並讓頁面改從 store 讀取資料，前端展示元件無需修改。
 */
export const useContentStore = defineStore('content', {
  state: () => ({
    ready: true as boolean,
    source: 'static' as 'static' | 'api' | 'cms' | 'database',
  }),
  actions: {
    async load() {
      // V1：靜態內容已於 build 時內嵌，無需載入。
      // 未來範例：this.source = 'api'; const data = await fetch('/api/...')
      this.ready = true
    },
  },
})
