# CONTENT GUIDE

所有文案與資料集中於 `src/content/`，**禁止把文案直接寫死在 Vue 元件內**。

## content/ 各檔用途

| 檔案 | 用途 |
| ---- | ---- |
| `types.ts` | 所有資料的型別契約（介面定義）。新增資料請先在此定義型別。 |
| `brand.ts` | **品牌核心資訊**（名稱、slogan、聯絡方式、社群、版權…）。全站單一來源。 |
| `navigation.ts` | **導覽與路由設定**（路徑、選單名稱、SEO title/description、是否顯示於 navbar/footer）。 |
| `images.ts` | 圖片來源輔助函式 `img()`（V1 使用 picsum 示意圖）。 |
| `hero.ts` | 首頁 Hero、雙入口、品牌理念。 |
| `services.ts` | 服務特色、服務項目、拍攝／服務流程、方案。 |
| `portfolio.ts` | 精選作品（首頁／婚紗／商業）。 |
| `reviews.ts` | 客戶評價。 |
| `faq.ts` | 常見問題（各頁與完整列表）。 |
| `about.ts` | 關於我們頁全部內容。 |
| `pages.ts` | 各頁 Banner 文案與表單選項。 |
| `index.ts` | 統一出口（barrel），方便引用。 |

## 新增內容的方式

### 1. 修改既有文字
直接編輯對應的 `content/*.ts`。例如改聯絡 Email → `brand.ts` 的 `email`。

### 2. 新增一筆資料（如新作品、新 FAQ）
在對應陣列（如 `portfolio.ts` 的 `featuredPortfolio`）依既有物件格式新增一筆即可。
型別會由 `types.ts` 自動檢查，缺欄位會在 build 時報錯。

### 3. 新增一個頁面
1. 在 `navigation.ts` 的 `navRoutes` 新增一筆（含 `name / path / navTitle / title / description / showInNavbar / showInFooter`）。
2. 在 `src/views/` 建立對應的 `XxxView.vue`。
3. 在 `src/router/index.ts` 的 `viewMap` 加入 `name → 元件` 對照。
4. （選用）在 `public/sitemap.xml` 補上該頁 URL。

> Navbar、Footer、SEO 會自動讀取，無需再改其他地方。

## 圖片放置規範

| 類型 | 路徑 |
| ---- | ---- |
| Hero 主視覺 | `public/images/hero/` |
| 作品 | `public/images/portfolio/` |
| 品牌／關於 | `public/images/brand/` |
| Logo | `public/images/logo/` |
| 介面圖示 | `public/images/icons/` |
| 社群分享圖 | `public/images/social/` |

- `public/` 內的檔案以絕對路徑引用，例如 `/images/portfolio/work-01.webp`。
- 尺寸與格式請參考 [BRAND_GUIDELINE.md](./BRAND_GUIDELINE.md) 的「圖片比例」。
- 目前作品圖使用 `content/images.ts` 的 `img()` 產生示意圖；換成正式素材時，
  將 content 內的 `img(...)` 改為實際路徑（如 `/images/portfolio/xxx.webp`）即可。

## 命名規範

- **檔案／資料夾**：小寫，多字以連字號 `-`（kebab-case），例如 `wedding-beach-01.webp`。
- **content 變數**：camelCase，集合用複數，例如 `weddingServices`、`featuredPortfolio`。
- **route name / key**：小寫單字，例如 `home`、`wedding`、`prewedding`。
- **元件**：PascalCase，共用基礎元件以 `Base` 開頭（`BaseButton`、`BaseCard`、`BaseSection`）。

## 不可違反的原則

- 元件內不得出現寫死的品牌資訊、導覽項目或長段文案。
- 同一份資料只能有一個來源（例如品牌 Email 只存在於 `brand.ts`）。
