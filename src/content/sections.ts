import type { SectionHeading, CtaContent } from './types'
import { weddingPhotos, brandingPhotos, productPhotos, adPhotos, aboutPhotos } from './photos'

/**
 * 各頁面的「區塊標題」與「CTA / Instagram 文案」集中管理。
 * 元件（views）不得直接寫死這些文字，一律引用此檔。
 */

/** 共用按鈕 / 連結文案 */
export const ui = {
  instagramMore: '在 Instagram 看更多',
  bookNow: '立即預約',
  lineConsult: 'LINE 諮詢',
  followInstagram: 'Follow Instagram',
  exploreMore: '探索更多',
} as const

/* ---------------------------- 全站統一 CTA ---------------------------- */
/**
 * 整站 CTA 文案統一：所有頁面共用同一組文案與 CtaSection 元件。
 * 主按鈕 → 立即預約（/contact）；次按鈕 → LINE 諮詢（brand.lineUrl）。
 */
export const defaultCta: CtaContent = {
  eyebrow: "Let's create together",
  title: '想聊聊你的拍攝需求？',
  description: '一起規劃最適合你的拍攝方案。',
  primaryLabel: ui.bookNow,
  secondaryLabel: ui.lineConsult,
}

/* --------------------------- 圖片穿插（引言 + 全幅圖） --------------------------- */
export const imageBreaks = {
  home: {
    eyebrow: 'Our Philosophy',
    quote: '我們不只是拍照，而是把當下的光、\n溫度與情緒，留成可以一再回味的影像。',
    image: weddingPhotos[4],
  },
  about: {
    eyebrow: 'Behind the Lens',
    quote: '好的影像\n來自願意花時間理解你的人。',
    image: aboutPhotos[1],
  },
  wedding: {
    eyebrow: 'Your Day',
    quote: '最動人的畫面\n往往發生在最自然的時刻。',
    image: weddingPhotos[9],
  },
  commercial: {
    eyebrow: 'Brand Story',
    quote: '讓品牌的每一張影像，都說出一致而有質感的故事。',
    image: adPhotos[2],
  },
} as const

/* --------------------------- Instagram 區塊 --------------------------- */
export const instagramBlock = {
  eyebrow: '@demistudio',
  title: 'Follow Our Journey',
  description: '更多即時更新的作品與幕後，都在我們的 Instagram。',
  images: [
    weddingPhotos[0],
    brandingPhotos[0],
    productPhotos[0],
    adPhotos[0],
    weddingPhotos[8],
    brandingPhotos[6],
  ],
}

/* ------------------------------- 首頁 ------------------------------- */
export const homeSections: Record<
  'features' | 'portfolio' | 'process' | 'reviews',
  SectionHeading
> = {
  features: {
    eyebrow: 'Why Demi Studio',
    title: '我們在意的事',
    description: '四個堅持，構成我們對每一張照片的態度。',
  },
  portfolio: {
    eyebrow: 'Selected Works',
    title: '精選作品',
    description: '從婚紗、婚禮到品牌形象，精選六組代表作品。',
  },
  process: {
    eyebrow: 'The Process',
    title: '拍攝流程',
    description: '清晰而安心的四個步驟，讓你的拍攝體驗從容自在。',
  },
  reviews: {
    eyebrow: 'Kind Words',
    title: '客戶評價',
    description: '謝謝每一位信任我們、把重要時刻交付給我們的你。',
  },
}

/* ----------------------------- 婚紗婚禮 ----------------------------- */
export const weddingSections: Record<
  'bridal' | 'ceremony' | 'couple' | 'portrait' | 'process' | 'plans' | 'faq',
  SectionHeading
> = {
  bridal: { eyebrow: 'Pre-Wedding', title: '婚紗作品', description: '量身規劃的場景與風格，呈現你們最自然的樣子。' },
  ceremony: { eyebrow: 'Wedding Day', title: '婚禮紀錄', description: '以紀實視角完整保留婚禮當日的每個感動。' },
  portrait: { eyebrow: 'Registration', title: '結婚登記', description: '記錄登記當日的儀式感與兩人最真實的表情。' },
  couple: { eyebrow: 'Couple', title: '情侶寫真', description: '記錄熱戀、紀念日與日常約會的甜蜜時光。' },
  process: { eyebrow: 'The Process', title: '拍攝流程' },
  plans: {
    eyebrow: 'Packages',
    title: '方案介紹',
    description: '以下為參考方案，亦可依你的需求量身規劃，價格僅供參考。',
  },
  faq: { eyebrow: 'FAQ', title: '常見問題' },
}

/* ----------------------------- 商業攝影 ----------------------------- */
export const commercialSections: Record<
  'services' | 'cases' | 'process' | 'consult' | 'faq',
  SectionHeading
> = {
  services: {
    eyebrow: 'Services',
    title: '服務內容',
    description: '從品牌形象、企業形象到商業攝影、活動紀錄與短影音的整合服務。',
  },
  cases: {
    eyebrow: 'Selected Works',
    title: '案例展示',
    description: '為品牌打造一致而具質感的視覺語言。',
  },
  process: { eyebrow: 'The Process', title: '合作流程' },
  consult: {
    eyebrow: 'Consultation',
    title: '專案諮詢',
    description:
      '商業攝影依品牌定位、用途與規模客製規劃，沒有制式方案。歡迎先與我們聊聊需求，再提供合適報價。',
  },
  faq: { eyebrow: 'FAQ', title: '常見問題' },
}
