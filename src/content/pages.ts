import type { AudienceContent, ProseSection, ProcessStep } from './types'
import { weddingPhotos, brandingPhotos, adPhotos } from './photos'

export interface PageBanner {
  eyebrow: string
  title: string
  description: string
  image: string
}

export const weddingBanner: PageBanner = {
  eyebrow: 'Wedding & Love',
  title: '把心動，\n留成永遠',
  description: '婚紗、婚禮、結婚登記與情侶寫真，以自然視角記錄屬於你們的故事。',
  image: weddingPhotos[8],
}

export const commercialBanner: PageBanner = {
  eyebrow: 'Brand & Business',
  title: '讓影像，\n說出品牌的話',
  description: '品牌形象、企業形象、商業攝影、活動紀錄與短影音的整合視覺服務。',
  image: adPhotos[8],
}

export const faqBanner: PageBanner = {
  eyebrow: 'FAQ',
  title: '常見問題',
  description: '關於預約、拍攝、交付與授權，我們整理了最常被問到的問題。',
  image: weddingPhotos[14],
}

export const contactBanner: PageBanner = {
  eyebrow: 'Contact',
  title: '一起聊聊\n你的故事',
  description: '無論是婚紗婚禮或品牌專案，歡迎留下訊息，我們會盡快與你聯繫。',
  image: brandingPhotos[8],
}

/* ----------------------------- 婚紗婚禮頁 ----------------------------- */
export const weddingIntro: ProseSection = {
  eyebrow: 'Our Belief',
  title: '最好的婚紗，\n是最像你們的樣子',
  paragraphs: [
    '我們不追求一致的範本與誇張的姿勢，而是花時間認識你們的故事，找到屬於你們的節奏與默契。',
    '從訂婚、婚紗到婚禮當日，以紀實與引導並行的方式，留下自然、溫暖、值得收藏一輩子的影像。',
  ],
  image: weddingPhotos[24],
}

export const weddingAudience: AudienceContent = {
  eyebrow: 'For You',
  title: '適合哪些新人',
  description: '如果你有以下任何一種想法，我們會是很適合的選擇。',
  items: [
    '第一次拍婚紗，沒有經驗也沒關係',
    '不擅長面對鏡頭、容易緊張',
    '喜歡自然互動、不愛生硬擺拍',
    '想留下真實而非過度修飾的回憶',
    '重視拍攝過程的舒適與信任感',
    '希望影像有質感、耐看不退流行',
  ],
}

/* ----------------------------- 商業攝影頁 ----------------------------- */
export const commercialIntro: ProseSection = {
  eyebrow: 'Our Belief',
  title: '影像，是品牌\n最有力的語言',
  paragraphs: [
    '一致而具質感的視覺，能在消費者心中建立信任與記憶點。\n我們從品牌定位出發，規劃符合調性的影像。',
    '不只是拍得漂亮，\n而是拍得「對」——讓每一張照片都為品牌溝通服務。',
  ],
  image: brandingPhotos[11],
}

export const commercialAudience: AudienceContent = {
  eyebrow: 'For Brands',
  title: '適合哪些品牌',
  description: '無論你是個人或企業，我們都能協助打造專業的品牌視覺。',
  items: [
    '個人品牌',
    '企業形象',
    '講師・顧問',
    '醫師・診所',
    '律師・專業服務',
    '健身教練',
    '房仲・不動產',
    '創作者・KOL',
    '電商・品牌商品',
  ],
}

/* ----------------------------- 聯絡頁 ----------------------------- */
/** 聯絡表單・選項 */
export const inquiryTypes: string[] = [
  '婚紗拍攝',
  '婚禮紀錄',
  '結婚登記／情侶寫真',
  '品牌／企業形象',
  '商業／產品攝影',
  '活動紀錄／短影音',
  '其他',
]

/** 聯絡頁全部文案（集中管理，元件不寫死） */
export const contactPage = {
  info: {
    eyebrow: 'Get in touch',
    title: '聯絡資訊',
    description: '歡迎來電或透過 LINE 與我們聯繫，也可填寫右側表單，我們會盡快回覆。',
    labels: {
      email: 'Email',
      phone: '電話',
      line: 'LINE',
      studio: '工作室',
    },
  },
  form: {
    name: { label: '姓名 *', placeholder: '您的姓名' },
    phone: { label: '電話 *', placeholder: '聯絡電話' },
    email: { label: 'Email（選填）', placeholder: 'your@email.com' },
    type: { label: '諮詢項目' },
    date: { label: '期望日期' },
    message: { label: '訊息內容', placeholder: '跟我們說說你的需求與想法…' },
    submit: '送出預約',
    submitting: '送出中…',
    success: '已成功送出，我們會盡快與你聯繫。',
    error: '送出失敗，請稍後再試，或改以電話／LINE 聯繫。',
  },
  map: {
    eyebrow: 'Find us',
    note: 'Google Map 預留區塊，未來可嵌入互動地圖。',
    ariaLabel: '地圖位置（預留）',
  },
  highlights: {
    serviceArea: { label: '服務地區', value: '大台北為主，全台與海外可另行安排' },
    responseTime: { label: '平均回覆時間', value: '24 小時內回覆（工作日）' },
    booking: { label: '預約方式', value: '線上表單・電話・LINE' },
  },
}

/** 聯絡頁・合作流程（Timeline） */
export const contactProcess: { heading: { eyebrow: string; title: string }; steps: ProcessStep[] } = {
  heading: { eyebrow: 'How it works', title: '合作流程' },
  steps: [
    { step: '01', title: '填寫預約', description: '透過表單、電話或 LINE 告訴我們你的需求與檔期。', icon: 'chat' },
    { step: '02', title: '需求討論', description: '安排線上或實體諮詢，確認風格、場景與報價。', icon: 'plan' },
    { step: '03', title: '安排拍攝', description: '簽訂合約、確認細節，於約定時間完成拍攝。', icon: 'camera' },
    { step: '04', title: '完成交件', description: '精修影像並以線上相簿與成品交付。', icon: 'deliver' },
  ],
}
