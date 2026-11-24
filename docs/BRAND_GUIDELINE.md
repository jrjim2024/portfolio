# BRAND GUIDELINE

品牌視覺規範。所有設計 token 定義於 `src/style.css` 的 `@theme`，請以此為唯一依據。

## 品牌調性

Modern Editorial × Lifestyle —— 大量留白、高級感、簡潔、溫暖、自然。
不偏婚禮、不偏企業，維持中性而精緻的編輯式風格。

## 品牌色

| 名稱 | 變數 | 色碼 | 用途 |
| ---- | ---- | ---- | ---- |
| Background | `--color-background` | `#FAF9F7` | 頁面底色 |
| Primary | `--color-primary` | `#111111` | 主色、深色區塊、標題 |
| Text / Ink | `--color-ink` | `#222222` | 內文 |
| Accent | `--color-accent` | `#B08A5A` | 點綴、連結、強調 |
| Accent Soft | `--color-accent-soft` | `#D8C4A8` | 深色底上的點綴 |
| Muted | `--color-muted` | `#6F6B66` | 次要文字 |
| Line | `--color-line` | `#E7E3DD` | 分隔線、邊框 |

> Tailwind 使用方式：`bg-background`、`text-primary`、`text-accent`、`border-line` 等。

## 字體

| 用途 | 字體 | 變數 |
| ---- | ---- | ---- |
| 中文 / 內文 | Noto Sans TC | `font-sans` |
| 英文標題 / 裝飾 | Cormorant Garamond | `font-serif`（`heading-serif`） |

- 內文預設 `font-weight: 300`，標題 `400`。
- 英文小標使用 `.eyebrow`（大寫、字距 `0.18em`、Accent 色）。

## 間距

- 頁面容器：`.container-page`（最大寬 1280px，左右 padding `px-6 / sm:px-8 / lg:px-12`）。
- 區塊上下留白：`BaseSection` 的 `spacing`
  - `normal`：`py-16 / sm:py-24 / lg:py-28`
  - `large`：`py-24 / sm:py-32 / lg:py-40`

## 按鈕

統一使用 `BaseButton`，提供四種 variant：

| variant | 樣式 | 使用情境 |
| ------- | ---- | -------- |
| `primary` | 深色底白字，hover 轉 Accent | 主要行動（預約） |
| `outline` | 線框 | 次要行動 |
| `ghost` | 純文字連結 | 輕量連結 |
| `light` | 白色線框 | 深色／圖片底上的按鈕 |

支援 `to`（站內路由）、`href`（外部連結）、`type`（button/submit）、`block`。

## Icon

- 一律使用 **SVG**（inline 或放置於 `public/images/icons/`）。
- 社群圖示由 `SocialIcon.vue` 提供（instagram / facebook / line / mail）。

## 圖片比例

| 用途 | 尺寸 | 比例 |
| ---- | ---- | ---- |
| Hero | 1920×1080 | 16:9 |
| Banner | 1600×900 | 16:9 |
| Portfolio | 1200×1500 | 4:5 |
| Thumbnail | 800×1000 | 4:5 |
| Logo | SVG | — |
| Icon | SVG | — |

- 圖片優先使用 **WebP**（次選 JPG）。
- 卡片圖片比例由元件控制：`portrait`(4:5) / `landscape`(4:3) / `square`(1:1)。

## 動效

- 進場淡入使用 `v-reveal` 指令（IntersectionObserver 觸發 `.is-visible`）。
- 緩動曲線：`--ease-soft`（`cubic-bezier(0.22, 1, 0.36, 1)`）。
- 尊重 `prefers-reduced-motion`，會自動停用動畫。
