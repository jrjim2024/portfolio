/**
 * 圖片來源輔助工具。
 *
 * V1 使用 picsum.photos 的 seed 模式產生穩定、可重現的示意圖，
 * 方便在沒有實際攝影素材時呈現完整版面。
 * 未來只需把 `img()` 換成 CDN / CMS 的圖片網址產生邏輯即可，
 * 內容檔（hero.ts、portfolio.ts…）完全不需更動。
 */
export function img(seed: string, width = 1200, height = 1500): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}
