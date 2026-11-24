/**
 * SEO 關鍵字、sitemap 優先權等靜態設定（不依賴圖片／品牌資產，方便建置腳本引用）。
 */
export const seoKeywords = [
  'Demi Studio',
  'demi studio',
  'demi-studio',
  '德米攝影',
  '德米攝影有限公司',
  'Demi Photo Studio',
  '德米攝影 Demi Photo Studio',
  'demiart2015',
  'demi_weddingstudio',
  '婚紗攝影',
  '婚禮攝影',
  '輕婚紗',
  '結婚登記攝影',
  '登記結婚攝影',
  '情侶寫真',
  '商業攝影',
  '品牌形象攝影',
  '產品攝影',
  '台北攝影師',
  '台北婚紗',
  '台灣婚禮紀錄',
] as const

/** sitemap 條目（與 navigation.ts 路徑保持一致） */
export const sitemapEntries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/wedding', changefreq: 'weekly', priority: '0.9' },
  { path: '/commercial', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
] as const
