# ROADMAP

品牌官網的分階段發展藍圖。核心原則：**前端展示層穩定，資料來源逐步升級**。

## 本機驗收與發布順序

1. **作品瀏覽**　以既有攝影作品驗收首頁、婚紗婚禮、商業攝影。首頁與商業作品可依現有分類篩選，婚禮頁沿用四個主題分區。作品可放大，以鍵盤或畫面按鈕切換。
2. **詢問流程**　從婚紗方案或商業服務進入聯絡頁，驗收方案提示、預選服務、欄位驗證與送出結果。Vite 開發模式提供展示送出。
3. **正式收件**　正式發布前，由工作室確認聯絡資訊與表單欄位，並用授權的收件表單測試一筆，核對 Google 表單回覆或試算表。瀏覽器送出後無法讀取 Google 表單的收件結果。
4. **內容維護**　等工作室需要自行更新作品、方案或 FAQ 時，再接 CMS。若需要即時檔期確認，再規劃排程、通知與訂金流程。

## V1 — 上線版本 ✅（已完成）

- 品牌形象官網（首頁、婚紗婚禮、商業攝影、關於我們、常見問題、聯絡我們）。
- 純前端、靜態內容、響應式設計、品牌視覺到位。
- 部署於 Vercel（GitHub 自動部署）。

## V1.1 — 架構優化 ✅（本次）

- 品牌資訊集中管理（`content/brand.ts`）。
- 導覽集中管理（`content/navigation.ts`）。
- SEO 基礎：`utils/seo.ts`（title / description / OG / canonical）、route meta、sitemap、robots、manifest、og-image。
- 圖片結構統一（`public/images/*`）與圖片規範文件。
- 環境變數 `.env.example`、Google Analytics 預留（`plugins/analytics.ts`）。
- 完整專案文件（`docs/`）。
- 程式碼整理、消除重複資料與 magic string。

## V2 — 內容可維護化（CMS 接入）

詳見 [Demi Studio 後台與獨立網站規劃](CMS_PLAN.md)。

- 導入 Headless CMS（如 Contentful / Sanity / Strapi）或 Git-based CMS。
- 將 `content/*` 改為由 CMS API 取得；透過預留的 Pinia `useContentStore` 載入。
- 作品、FAQ、方案、評價可由非工程人員後台編輯。
- 因展示元件僅依賴 `types.ts` 契約，**UI 無需改寫**。

## V3 — 功能擴充

- 多語系（i18n）。
- 線上預約系統（表單串接後端 / 第三方排程服務）。
- 作品分類篩選與 Lightbox 瀏覽（本機已完成）。
- 部落格 / 案例文章。
- 表單後端化（email 通知、CRM 串接）。

## 未來功能候選（待評估）

- 會員 / 客戶相簿交付區。
- 金流 / 訂金線上付款。
- 進階分析與 A/B 測試。
- 圖片 CDN 與自動 WebP 轉檔流程。

> 升級時請維持「資料來源可替換、展示元件不變」的原則，確保長期可維護性。
