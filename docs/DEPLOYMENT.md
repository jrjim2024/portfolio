# DEPLOYMENT

本文件包含既有的 Vercel 純前台流程，以及含後台的 Node.js 正式部署流程。Demi Studio 要上線後台時，採用本文件的「含後台的正式部署」。

## 本機開發

```bash
npm install      # 安裝相依套件
npm run dev      # 開發伺服器 http://localhost:5173
npm run build    # 型別檢查 + 正式建置（輸出 dist/）
npm run preview  # 預覽 build 結果
npm run type-check # 僅執行 TypeScript 型別檢查
```

## 環境變數

1. 複製 `.env.example` 為 `.env`。
2. 依需求填入（全部留空也能正常運作，會使用 `brand.ts` 預設值）：

| 變數 | 說明 |
| ---- | ---- |
| `VITE_SITE_NAME` | 品牌名稱 |
| `VITE_SITE_URL` | 正式網址（SEO canonical / og:url） |
| `VITE_INSTAGRAM_URL` | Instagram 連結 |
| `VITE_FACEBOOK_URL` | Facebook 連結 |
| `VITE_LINE_URL` | LINE 連結 |
| `VITE_GOOGLE_MAP_URL` | Google Map 連結 |
| `VITE_GA_ID` | Google Analytics 4 ID（留空則不載入） |

> 只有 `VITE_` 開頭的變數會被前端讀取。`.env` 已被 `.gitignore` 忽略，不會進版控。
> 在 Vercel 上，請於 Project → Settings → Environment Variables 設定相同變數。

## GitHub

- Repo：`jrjim2024/photography`
- 主分支：`main`

```bash
git add -A
git commit -m "your message"
git push           # 推送後 Vercel 會自動部署
```

## Vercel

設定已寫入根目錄 `vercel.json`，匯入後無需手動調整：

| 項目 | 值 |
| ---- | ---- |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Rewrites | 全部導向 `/index.html`（支援 SPA 前端路由） |

### 首次匯入

1. 登入 Vercel → **Add New → Project**。
2. 匯入 `jrjim2024/photography`（私有 repo 需在 GitHub App 權限授權該 repo）。
3. 保持預設設定 → **Deploy**。
4. 完成後取得 `https://<project>.vercel.app` 網址。

### 後續更新

每次 `git push` 到 `main`，Vercel 會自動重新建置並上線，網址不變。

## Custom Domain（自訂網域）

1. Vercel → Project → **Settings → Domains** → 輸入網域並 **Add**。
2. 依 Vercel 指示，到網域 DNS 設定：
   - 根網域（`example.com`）：新增 `A` 記錄指向 Vercel 提供的 IP。
   - 子網域（`www.example.com`）：新增 `CNAME` 指向 `cname.vercel-dns.com`。
3. DNS 生效後 Vercel 會自動簽發 SSL 憑證（HTTPS）。
4. 上線後請同步更新：
   - `.env` / Vercel 的 `VITE_SITE_URL`
   - `public/robots.txt` 與 `public/sitemap.xml` 內的網域
   - `src/content/brand.ts` 的 `url`（若未用環境變數）

## SEO 檔案

| 檔案 | 說明 |
| ---- | ---- |
| `public/robots.txt` | 搜尋引擎索引規則 |
| `public/sitemap.xml` | 網站地圖（新增頁面請同步補上） |
| `public/site.webmanifest` | PWA / 行動裝置設定 |
| `public/favicon.svg` / `favicon.ico` / `apple-touch-icon.png` | 網站圖示 |
| `public/og-image.jpg` | 社群分享預覽圖（1200×630） |
## 含後台的正式部署

正式站須執行 Node 伺服器，讓前台、後台、API 和圖片共用同一個網域。既有的純靜態部署只能提供前台預設內容。

| 項目 | 正式設定 |
| --- | --- |
| 主機 | Node.js 24、單一常駐服務實例、支援可掛載的持久化儲存。執行 `npm ci` 和 `npm run build`，以 `npm start` 啟動。執行 `npm ci` 時保留建置與影像套件，供 Vite 建置及 Sharp 上傳轉檔使用。 |
| 持久化儲存 | 將 `DEMI_DATA_DIR` 指向掛載目錄，例如 `/data/demi-studio`。服務帳戶須可讀寫此目錄，同一個目錄須跨程序重啟和重新部署使用。 |
| 容量與備份 | 主要用量來自 `media/`。以預計圖片數量乘上 WebP 實際平均大小估算，另保留草稿、未使用檔案及備份空間。定期備份整個資料目錄並試做還原。 |
| 連接埠與 HTTPS | `PORT` 使用主機分配的內部埠。對外由反向代理或平台提供 HTTPS，保留訪客的 `Host`，並允許 12 MiB 圖片上傳。公開站、`/admin` 與 `/api/local-cms/` 共用同一網域。 |
| 網域與 DNS | 由工作室帳戶持有網域，依主機指示設定根網域和 `www` 的 DNS 記錄。選一個主網域，另一個做永久轉址。HTTPS 憑證應涵蓋兩個對外網域。 |
| 網域環境變數 | `DEMI_PUBLIC_ORIGIN` 設成完整 HTTPS 主網域，例如 `https://demi.example.com`。建置時也把 `VITE_SITE_URL` 設成相同網址，檢查 canonical、sitemap 和 robots.txt。 |

資料目錄保存 `accounts.json`（帳號、雜湊密碼與權限）、`content.json`（草稿、已發布及上一版內容）和 `media/`（上傳圖片）。本機帳號與測試密碼不帶到正式站。正式站由空資料目錄初始化管理者，首次登入後變更密碼，再建立工作室使用者。程序重啟後需重新登入，帳號與操作權限會從持久化目錄重新載入。

此版本可先以單一服務與持久化磁碟上線。若未來需要多台主機同時服務，再將帳號與內容移至共享資料庫，圖片移至統一物件儲存，登入狀態改用跨實例的儲存方式。

正式 DNS 切換前，在測試主機依序驗證登入與權限、圖片上傳、草稿預覽、發布、回復、程序重啟及備份還原。DNS 切換後再驗證 HTTPS、主網域轉址、網站地圖及正式詢問表單收件。

在本機驗證正式建置時，可執行 `npm run build` 後使用 `npm start`。如原開發站正在使用 5313，請另設 `PORT`。本機測試可將 `DEMI_DATA_DIR` 指向獨立資料夾。
