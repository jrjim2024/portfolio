/**
 * Google Analytics 預留外掛（V1.1 尚未啟用）。
 *
 * 目前不會載入任何追蹤碼。未來只要在 `.env` 填入 VITE_GA_ID，
 * 此函式即會自動注入 GA4 (gtag.js)，元件與頁面無需修改。
 */
export function initAnalytics(): void {
  const gaId = import.meta.env.VITE_GA_ID
  if (!gaId) return

  // --- 以下為未來啟用 GA4 的範例（目前 gaId 為空時不會執行）---
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  const inline = document.createElement('script')
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `
  document.head.appendChild(inline)
}
