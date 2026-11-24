import type { Brand, SocialLink } from './types'
import { logoImage } from './photos'
import { OFFICIAL_SOCIALS, SITE_URL } from './site'

const env = import.meta.env

/**
 * 品牌理念段落 —— Footer / 首頁 / 關於我們 單一資料來源。
 */
export const brandPhilosophyParagraphs = [
  'Demi 在法文中是「一半」的意思。',
  '我負責觀察光線、安排構圖、引導情緒，找到最自然、最好看的瞬間。',
  '而照片的另一半，來自你們之間真實的笑容、互動與故事。',
  '照片一半由我完成，另一半，則由我們一起創造。',
] as const

/** 判斷社群網址是否為可對外使用的完整連結（排除平台首頁佔位）。 */
function isMeaningfulSocialUrl(href: string): boolean {
  try {
    const u = new URL(href)
    const host = u.hostname.replace(/^www\./, '')
    const path = u.pathname.replace(/\/+$/, '') || '/'
    if ((host === 'instagram.com' || host === 'facebook.com') && path === '/') return false
    return true
  } catch {
    return false
  }
}

/**
 * 讀取環境變數；空字串視為未設定，改用程式內建預設（保證雲端無 .env 也能運作）。
 */
function envOr(value: string | undefined, fallback: string): string {
  const v = value?.trim()
  return v ? v : fallback
}

/**
 * 品牌核心資訊 —— 全站單一資料來源。
 *
 * SEO／社群／網址的「正式值」寫在 `site.ts` 與下方預設，會進 Git、會進 Vercel。
 * `.env` 僅供本機覆寫或機密（GA、表單 ID、驗證碼）；留空不影響 SEO。
 */
export const brand: Brand = {
  name: envOr(env.VITE_SITE_NAME, 'Demi Studio'),
  legalName: '德米攝影有限公司',
  alternateNames: [
    '德米攝影',
    'Demi Photo Studio',
    'demi-studio',
    'demi studio',
    '德米攝影 Demi Photo Studio',
  ],
  slogan: '照片一半由我完成，另一半，則由我們一起創造。',
  description:
    'Demi Studio（德米攝影／Demi Photo Studio）提供台北婚紗攝影、婚禮紀錄、結婚登記與商業／品牌形象攝影。Demi 在法文中是「一半」的意思；照片一半由我完成，另一半，則由我們一起創造。',
  philosophy: [...brandPhilosophyParagraphs],
  logo: logoImage,
  url: envOr(env.VITE_SITE_URL, SITE_URL),
  email: 'hello@demi-studio.com',
  phone: '0907-493-168',
  line: 'noreg0108808',
  address: '台北市大安區光復南路 100 號 5 樓',
  hours: '週一至週六 11:00 – 19:00（採預約制）',
  instagram: envOr(env.VITE_INSTAGRAM_URL, OFFICIAL_SOCIALS.instagram),
  facebook: envOr(env.VITE_FACEBOOK_URL, OFFICIAL_SOCIALS.facebook),
  lineUrl: envOr(env.VITE_LINE_URL, OFFICIAL_SOCIALS.lineUrl),
  googleMapUrl: envOr(env.VITE_GOOGLE_MAP_URL, ''),
  copyright: 'Demi Studio',
}

/** Footer 網站製作署名（與品牌版權分開） */
export const siteCredit = {
  prefix: 'Made by',
  label: 'jrjim',
  href: 'https://github.com/jrjim2024',
}

/**
 * 聯絡頁顯示開關。
 * - info：左側「聯絡資訊」區塊（電話／LINE）
 * - email：品牌信箱（對外隱藏）
 * - studio：工作室地址、營業時間、地圖
 */
export const contactVisibility = {
  info: true,
  email: false,
  studio: false,
}

/** 社群連結，集中由 brand 衍生；佔位網址不顯示。 */
export const socials: SocialLink[] = (
  [
    { label: 'Instagram', href: brand.instagram, icon: 'instagram' as const },
    { label: 'Facebook', href: brand.facebook, icon: 'facebook' as const },
    { label: 'LINE', href: brand.lineUrl, icon: 'line' as const },
  ] satisfies SocialLink[]
).filter((s) => Boolean(s.href) && isMeaningfulSocialUrl(s.href))

/** Instagram 未設定時改連官方 Facebook（作品／社群入口） */
export const socialPortfolioUrl = brand.instagram || brand.facebook
