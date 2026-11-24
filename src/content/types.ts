/**
 * 內容資料層的共用型別定義。
 * 所有 content/*.ts 皆以這些介面為契約，未來改接 API / CMS 時
 * 只要回傳的資料符合這些型別，展示元件即可無痛沿用。
 */

export interface CtaLink {
  label: string
  /** 站內路由路徑，例如 /contact；外部連結請使用 href */
  to?: string
  /** 外部連結網址，例如 Instagram */
  href?: string
}

export interface HeroContent {
  eyebrow: string
  title: string
  /** 標題以 \n 換行時可拆成多行呈現 */
  subtitle: string
  description: string
  image: string
  primaryCta: CtaLink
  secondaryCta: CtaLink
}

export interface DualEntry {
  key: string
  label: string
  title: string
  description: string
  image: string
  to: string
}

export interface Feature {
  title: string
  description: string
  /** 數字編號或簡短代號，用於視覺呈現 */
  index?: string
  /** 代表圖片（可選），用於圖文卡片呈現 */
  image?: string
}

export interface ServiceItem {
  key: string
  name: string
  description: string
  image: string
}

/** 流程步驟圖示種類（Timeline 使用） */
export type ProcessIcon = 'chat' | 'plan' | 'camera' | 'deliver'

export interface ProcessStep {
  step: string
  title: string
  description: string
  /** 步驟圖示（可選），Timeline 會顯示於編號圓點中 */
  icon?: ProcessIcon
}

export interface Plan {
  name: string
  price: string
  unit?: string
  description: string
  features: string[]
  featured?: boolean
}

export interface PortfolioItem {
  id: string
  title: string
  category: 'wedding' | 'prewedding' | 'couple' | 'portrait' | 'brand' | 'commercial' | 'event'
  categoryLabel: string
  image: string
  /** 圖片長寬比偏好，供瀑布／網格排版使用 */
  ratio?: 'portrait' | 'landscape' | 'square'
}

export interface Review {
  id: string
  quote: string
  author: string
  role: string
  rating?: number
}

export interface FaqItem {
  question: string
  answer: string
  /** 分類，方便 FAQ 頁面分群顯示 */
  group?: string
}

export interface SocialLink {
  label: string
  href: string
  /** 圖示鍵值，對應元件中的 inline svg */
  icon: 'instagram' | 'facebook' | 'line' | 'mail'
}

/** 區塊標題（小標 / 主標 / 說明），供各頁 BaseSection 使用。 */
export interface SectionHeading {
  eyebrow?: string
  title: string
  description?: string
}

/** CTA 區塊文案。 */
export interface CtaContent {
  eyebrow?: string
  title?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
}

/** 品牌價值（Icon + 短文）。 */
export interface BrandValue {
  icon: 'interaction' | 'emotion' | 'quality'
  title: string
  description: string
}

/** 「適合哪些客戶／品牌」區塊。 */
export interface AudienceContent extends SectionHeading {
  items: string[]
}

/** 文字段落型區塊（品牌理念 / 我們相信等）。 */
export interface ProseSection extends SectionHeading {
  paragraphs: string[]
  image?: string
}

/**
 * 品牌核心資訊（單一資料來源）。
 * Navbar / Footer / Contact / SEO 皆讀自 `content/brand.ts`，不得重複定義。
 */
export interface Brand {
  name: string
  /** 公司登記名稱 */
  legalName: string
  /** 對外常用別名（SEO／JSON-LD alternateName） */
  alternateNames: string[]
  slogan: string
  description: string
  /** 品牌理念段落（Footer / About / 首頁共用） */
  philosophy: string[]
  logo: string
  /** 網站正式網址，供 SEO canonical / og:url 使用 */
  url: string
  email: string
  phone: string
  line: string
  address: string
  hours: string
  instagram: string
  facebook: string
  lineUrl: string
  googleMapUrl: string
  copyright: string
}

/**
 * 導覽路由設定（單一資料來源）。
 * 同時供 Vue Router 產生路由、Navbar/Footer 產生選單、以及 SEO meta 使用。
 */
export interface NavRoute {
  /** 對應 Vue Router 的 route name */
  name: string
  path: string
  /** 選單顯示名稱 */
  navTitle: string
  /** SEO 頁面標題 */
  title: string
  /** SEO 頁面描述 */
  description: string
  showInNavbar: boolean
  showInFooter: boolean
}
