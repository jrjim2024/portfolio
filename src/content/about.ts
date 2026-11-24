import { weddingPhotos, aboutPhotos } from './photos'
import { brand } from './brand'

export const about = {
  banner: {
    eyebrow: 'About Demi Studio',
    title: '我們相信，\n影像能留住時間',
    description: 'Demi Studio／德米攝影有限公司。\n照片一半由我完成，另一半，則由我們一起創造。',
    image: weddingPhotos[0],
  },

  /** 品牌理念（與 brand.philosophy 單一來源同步） */
  philosophy: {
    eyebrow: 'Philosophy',
    title: '品牌理念',
    paragraphs: [...brand.philosophy],
  },

  /** 我們相信 */
  believe: {
    eyebrow: 'We Believe',
    title: '我們相信',
    items: [
      { title: '真實，勝過完美', description: '我們追求動人的真實，而非無瑕卻冰冷的畫面。' },
      { title: '陪伴，造就好照片', description: '信任與舒適，是自然神情最重要的前提。' },
      { title: '質感，經得起時間', description: '克制的美學，讓影像多年後依然耐看。' },
    ],
  },

  /** 攝影風格 */
  style: {
    eyebrow: 'Style',
    title: '攝影風格',
    items: [
      { title: 'Editorial', description: '雜誌般的構圖與留白，乾淨而具敘事感。' },
      { title: 'Natural Light', description: '偏好自然光，呈現柔和真實的色調。' },
      { title: 'Warm & Calm', description: '溫暖、安靜、不喧囂的影像氛圍。' },
    ],
  },

  /** 服務理念 */
  serviceBelief: {
    eyebrow: 'Service',
    title: '服務理念',
    paragraphs: [
      '我們重視拍攝前的溝通，因為理解你，才能拍出真正屬於你的影像。',
      '從諮詢、拍攝到交付，每一個環節都力求細緻與安心，讓你能安心交付重要的時刻。',
    ],
  },

  /** 合作方式 */
  collaboration: {
    eyebrow: 'How We Work',
    title: '合作方式',
    steps: [
      { step: '01', title: '聯繫諮詢', description: '了解需求與期待，確認檔期與方向。', icon: 'chat' as const },
      { step: '02', title: '規劃確認', description: '討論風格、場景與細節，簽訂合約。', icon: 'plan' as const },
      { step: '03', title: '拍攝執行', description: '在舒適的節奏中完成拍攝。', icon: 'camera' as const },
      { step: '04', title: '精修交付', description: '精選細修，交付線上相簿與成品。', icon: 'deliver' as const },
    ],
  },

  /** 攝影師介紹（置於品牌敘事之後） */
  photographer: {
    eyebrow: 'Photographer',
    name: '許哲耀',
    title: '主理攝影師',
    bio: [
      '擁有超過十年的人像與商業攝影經驗，作品橫跨婚紗、婚禮與品牌形象。',
      '相信好的照片來自信任，習慣以對話與陪伴，讓鏡頭前的每個人都能自在做自己。',
    ],
    image: aboutPhotos[25],
    /** 經歷與合作名單 */
    resume: [
      {
        title: '教學',
        items: [
          '中和高中 — 攝影社指導老師',
          '中華科技大學 — 外聘攝影學老師',
          '協和工商 — 攝影社指導老師',
          '松山工農 — 攝影社指導老師',
        ],
      },
      {
        title: '拍攝',
        items: [
          '2014 Google 亞洲記者會攝影',
          '2017 Gogoro 商業攝影',
          '2018 台北電影節活動紀錄',
          '2018 金馬獎獨立攝影',
          '2018 金馬創投會議活動紀錄',
          '2020 宜蘭消防猛男年曆',
          '2021 全聯 × 賽珍珠基金會廣告拍攝',
          '2024 拳上 — 主賽形象照',
        ],
      },
      {
        title: '拍攝藝人',
        items: [
          '吳宗憲、沈玉琳、徐乃麟、蔡康永、謝震廷、藍星蕾、劉耕宏、吳怡霈、賴慧如、王燦、陳曼青、田依甯、費丹尼、梓梓、陳伊、小百合、中原由貴、趙小喬、郁芳……',
        ],
      },
      {
        title: '奧運選手',
        items: ['黃筱雯、戴資穎、盧彥勳……'],
      },
    ],
  },

  /** 工作花絮（預留，未來放置幕後照片） */
  behindScenes: {
    eyebrow: 'Behind the Scenes',
    title: '工作花絮',
    description: '幕後花絮即將更新，敬請期待我們在拍攝現場的故事。',
    images: [
      aboutPhotos[3],
      aboutPhotos[12],
      aboutPhotos[18],
    ],
  },
}
