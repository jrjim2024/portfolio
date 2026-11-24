import { brand, contactVisibility, socials } from '@/content/brand'
import { seoKeywords } from '@/content/seoMeta'
import { faqCategories } from '@/content/faq'

/**
 * 統一的 SEO 設定工具。
 * 所有頁面的 title / description / Open Graph / canonical / JSON-LD
 * 皆由此模組設定，由 router 於每次切換路由時呼叫 `applySeo()`。
 */

const TITLE_SEPARATOR = '｜'
const OG_IMAGE_PATH = '/og-image.jpg'
const OG_IMAGE_WIDTH = '1200'
const OG_IMAGE_HEIGHT = '630'
const SITE_JSON_LD_ID = 'site-jsonld'
const BREADCRUMB_JSON_LD_ID = 'breadcrumb-jsonld'
const PAGE_JSON_LD_ID = 'page-jsonld'

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, attrs: Record<string, string> = {}) {
  const extra = Object.entries(attrs)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join('')
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${extra}`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** 組出絕對網址（去掉多餘斜線）。 */
export function absoluteUrl(path = '/'): string {
  const base = brand.url.replace(/\/$/, '')
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function resolveAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = brand.url.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/** 設定頁面標題（自動帶上品牌名稱；首頁用品牌＋公司名）。 */
export function setTitle(title?: string): void {
  const trimmed = title?.trim()
  document.title = trimmed
    ? `${trimmed}${TITLE_SEPARATOR}${brand.name}`
    : `${brand.name}${TITLE_SEPARATOR}${brand.legalName}`
}

/** 設定 meta description。 */
export function setDescription(description: string): void {
  upsertMeta('meta[name="description"]', 'name', 'description', description)
}

/** 設定關鍵字（輔助訊號；核心仍仰賴 title／description／內容）。 */
export function setKeywords(keywords: string[] = [...seoKeywords]): void {
  upsertMeta('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '))
}

/** 設定 robots。 */
export function setRobots(
  content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
): void {
  upsertMeta('meta[name="robots"]', 'name', 'robots', content)
  upsertMeta('meta[name="googlebot"]', 'name', 'googlebot', content)
}

export interface OpenGraphInput {
  title: string
  description: string
  url: string
  image?: string
  type?: string
}

/** 設定 Open Graph（與 Twitter Card）標籤。 */
export function setOG({ title, description, url, image, type = 'website' }: OpenGraphInput): void {
  const trimmed = title?.trim()
  const fullTitle = trimmed
    ? `${trimmed}${TITLE_SEPARATOR}${brand.name}`
    : `${brand.name}${TITLE_SEPARATOR}${brand.legalName}`
  const ogImage = resolveAssetUrl(image ?? OG_IMAGE_PATH)

  upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', brand.name)
  upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', 'zh_TW')
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', type)
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
  upsertMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', ogImage)
  upsertMeta('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/jpeg')
  upsertMeta('meta[property="og:image:width"]', 'property', 'og:image:width', OG_IMAGE_WIDTH)
  upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', OG_IMAGE_HEIGHT)
  upsertMeta(
    'meta[property="og:image:alt"]',
    'property',
    'og:image:alt',
    `${brand.name} — ${brand.legalName}`,
  )

  upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)
  upsertMeta(
    'meta[name="twitter:image:alt"]',
    'name',
    'twitter:image:alt',
    `${brand.name} — ${brand.legalName}`,
  )
}

/** 寫入或更新 JSON-LD；傳 null 則移除。 */
export function setJsonLd(data: Record<string, unknown> | null, id: string): void {
  const existing = document.getElementById(id)
  if (!data) {
    existing?.remove()
    return
  }
  let el = existing as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/** 設定 canonical 與 hreflang。 */
export function setCanonical(url: string): void {
  upsertLink('canonical', url)
  upsertLink('alternate', url, { hreflang: 'zh-Hant' })
  upsertLink('alternate', url, { hreflang: 'x-default' })
}

function buildSiteJsonLd(): Record<string, unknown> {
  const links = [
    ...new Set(
      socials
        .map((s) => s.href)
        .filter(Boolean)
        .concat([brand.instagram, brand.facebook, brand.lineUrl].filter(Boolean)),
    ),
  ]

  const alternateNames = [
    brand.legalName,
    ...brand.alternateNames,
  ].filter((name, i, arr) => name && arr.indexOf(name) === i)

  const business: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'PhotographyBusiness', 'LocalBusiness'],
    '@id': `${absoluteUrl('/')}#business`,
    name: brand.name,
    legalName: brand.legalName,
    alternateName: alternateNames,
    description: brand.description,
    slogan: brand.slogan,
    url: absoluteUrl('/'),
    image: resolveAssetUrl(OG_IMAGE_PATH),
    logo: resolveAssetUrl('/apple-touch-icon.png'),
    telephone: brand.phone,
    priceRange: '$$',
    areaServed: [
      { '@type': 'City', name: '台北' },
      { '@type': 'AdministrativeArea', name: '台灣' },
    ],
    sameAs: links,
    knowsAbout: [...seoKeywords],
    brand: {
      '@type': 'Brand',
      name: brand.name,
      alternateName: alternateNames,
    },
  }

  if (contactVisibility.email) {
    business.email = brand.email
  }

  if (contactVisibility.studio && brand.address) {
    business.address = {
      '@type': 'PostalAddress',
      streetAddress: brand.address,
      addressLocality: '台北市',
      addressCountry: 'TW',
    }
    if (brand.hours) {
      business.openingHours = brand.hours
    }
  }

  const website: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: brand.name,
    alternateName: alternateNames,
    url: absoluteUrl('/'),
    description: brand.description,
    inLanguage: 'zh-Hant',
    publisher: { '@id': `${absoluteUrl('/')}#business` },
    about: { '@id': `${absoluteUrl('/')}#business` },
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [business, website],
  }
}

function buildBreadcrumbJsonLd(path: string, pageTitle: string): Record<string, unknown> {
  const items: Array<{ name: string; path: string }> = [{ name: '首頁', path: '/' }]
  if (path && path !== '/') {
    items.push({ name: pageTitle || path, path })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function buildFaqJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqCategories.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    ),
  }
}

export interface SeoMeta {
  title: string
  description: string
  /** 站內路徑，例如 /wedding */
  path?: string
  image?: string
  keywords?: string[]
  /** 額外頁面級 JSON-LD；傳 null 可清除 */
  pageJsonLd?: Record<string, unknown> | null
}

/** 一次套用整頁 SEO 設定。 */
export function applySeo({
  title,
  description,
  path = '/',
  image,
  keywords,
  pageJsonLd,
}: SeoMeta): void {
  const url = absoluteUrl(path)
  const isHome = path === '/' || path === ''
  // 首頁：品牌名在前＋別名／服務關鍵字；內頁：頁面標題｜品牌
  const pageTitle = isHome ? '' : title
  const homeDocumentTitle = title?.trim()
    ? `${brand.name}${TITLE_SEPARATOR}${title.trim()}`
    : `${brand.name}${TITLE_SEPARATOR}德米攝影 Demi Photo Studio`

  if (isHome) {
    document.title = homeDocumentTitle
  } else {
    setTitle(pageTitle)
  }
  setDescription(description)
  setKeywords(keywords)
  setRobots()
  setCanonical(url)
  setOG({
    title: isHome ? '' : title,
    description,
    url,
    image,
  })

  // 首頁 OG title 與 document.title 對齊
  if (isHome) {
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', homeDocumentTitle)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', homeDocumentTitle)
  }

  upsertMeta('meta[name="author"]', 'name', 'author', brand.legalName)
  upsertMeta('meta[name="application-name"]', 'name', 'application-name', brand.name)
  upsertMeta(
    'meta[name="subject"]',
    'name',
    'subject',
    '德米攝影 Demi Photo Studio｜婚紗婚禮與商業攝影',
  )

  const verification = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim()
  if (verification) {
    upsertMeta('meta[name="google-site-verification"]', 'name', 'google-site-verification', verification)
  }

  setJsonLd(buildSiteJsonLd(), SITE_JSON_LD_ID)
  setJsonLd(buildBreadcrumbJsonLd(path, title), BREADCRUMB_JSON_LD_ID)

  if (pageJsonLd !== undefined) {
    setJsonLd(pageJsonLd, PAGE_JSON_LD_ID)
  } else if (path === '/faq') {
    setJsonLd(buildFaqJsonLd(), PAGE_JSON_LD_ID)
  } else {
    setJsonLd(null, PAGE_JSON_LD_ID)
  }
}
