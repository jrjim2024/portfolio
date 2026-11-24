# PROJECT OVERVIEW

## 網站定位

本專案是 **DEMI STUDIO 攝影工作室的品牌形象官網**，風格定調為 **Modern Editorial × Lifestyle**。

- ✅ 這是一個**品牌官網**：用來建立品牌形象、傳達理念、帶來預約諮詢。
- ❌ 這**不是作品管理／後台系統**：不提供上傳、編輯、會員、搜尋等功能。

## 目前架構（V1.1）

- 純前端靜態網站，**無後端、無資料庫、無 CMS、無登入**。
- 所有文字與資料皆為 **Static Content**，集中於 `src/content/*`。
- 部署於 Vercel，透過 GitHub 自動建置上線。

## 技術棧

| 類別 | 技術 |
| ---- | ---- |
| 框架 | Vue 3（`<script setup>`） |
| 語言 | TypeScript |
| 建置 | Vite |
| 路由 | Vue Router |
| 樣式 | Tailwind CSS 4 |
| 狀態 | Pinia（僅預留，尚未啟用） |

## 資料流與未來升級

目前資料來源為靜態內容，架構已預留未來升級路線：

```
Static Content  →  API  →  CMS  →  Database
```

展示元件只依賴 `src/content/types.ts` 的型別契約取得資料，
未來改接 API / CMS 時，只要回傳資料符合既有型別，**展示元件無需修改**。

## 專案結構速覽

```
docs/                 專案文件
public/               靜態資產（圖片、favicon、SEO 檔案）
  images/             圖片分類資料夾
src/
  content/            所有文案與資料（單一資料來源）
    brand.ts            品牌資訊
    navigation.ts       導覽與路由設定
    types.ts            資料型別契約
    ...                 hero / services / portfolio / reviews / faq / about / pages
  components/         共用 UI 元件
  views/              頁面
  router/             路由（由 navigation.ts 推導）
  utils/seo.ts        SEO 工具
  plugins/analytics.ts Google Analytics 預留
  stores/             Pinia（預留）
  directives/         自訂指令（v-reveal）
```

詳見：

- 品牌視覺規範 → [BRAND_GUIDELINE.md](./BRAND_GUIDELINE.md)
- 內容維護方式 → [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)
- 部署流程 → [DEPLOYMENT.md](./DEPLOYMENT.md)
- 發展藍圖 → [ROADMAP.md](./ROADMAP.md)
