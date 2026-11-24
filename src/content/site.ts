/**
 * 網站正式網址與對外常數（寫死在程式內，部署不依賴 .env）。
 * 日後若綁定自訂網域，改此處並同步 index.html／robots.txt／sitemap 即可。
 */
export const SITE_URL = 'https://demi-studio.vercel.app'

export const OFFICIAL_SOCIALS = {
  instagram: 'https://www.instagram.com/demi_weddingstudio/',
  facebook: 'https://www.facebook.com/demiart2015/',
  lineUrl: 'https://line.me/ti/p/~noreg0108808',
} as const
