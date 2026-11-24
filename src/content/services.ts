import type { Feature, ServiceItem, ProcessStep, Plan } from './types'
import { weddingPhotos, aboutPhotos, productPhotos, brandingPhotos, adPhotos } from './photos'

/** 首頁・服務特色 */
export const features: Feature[] = [
  {
    index: '01',
    title: '自然光影',
    description: '善用環境中的自然光，呈現柔和、有空氣感的影像質地。',
    image: productPhotos[4],
  },
  {
    index: '02',
    title: '真實情感',
    description: '引導而非擺拍，捕捉互動之間最自然流露的神情與溫度。',
    image: weddingPhotos[10],
  },
  {
    index: '03',
    title: '編輯式構圖',
    description: '以雜誌般的視覺敘事與留白，賦予照片高級而簡潔的質感。',
    image: adPhotos[3],
  },
  {
    index: '04',
    title: '全程陪伴',
    description: '從前期溝通到成品交付，提供細緻而安心的一條龍服務。',
    image: aboutPhotos[20],
  },
]

/** 婚紗婚禮・服務項目 */
export const weddingServices: ServiceItem[] = [
  {
    key: 'prewedding',
    name: '婚紗作品',
    description: '城市、海岸、自然，量身規劃屬於你們的婚紗場景與風格。',
    image: weddingPhotos[0],
  },
  {
    key: 'wedding',
    name: '婚禮紀錄',
    description: '婚禮當日的每個細節與感動，以紀實視角完整保留。',
    image: weddingPhotos[3],
  },
  {
    key: 'portrait',
    name: '結婚登記',
    description: '記錄登記當日的儀式感與兩人最真實的表情。',
    image: weddingPhotos[9],
  },
  {
    key: 'couple',
    name: '情侶寫真',
    description: '記錄熱戀、紀念日或日常約會，留下兩人最自在的模樣。',
    image: weddingPhotos[6],
  },
]

/** 商業攝影・服務項目 */
export const commercialServices: ServiceItem[] = [
  {
    key: 'brand',
    name: '品牌形象',
    description: '建立一致而具辨識度的品牌視覺，傳遞理念與調性。',
    image: brandingPhotos[7],
  },
  {
    key: 'corporate',
    name: '企業形象',
    description: '專業而有溫度的團隊、人物與空間形象攝影。',
    image: brandingPhotos[1],
  },
  {
    key: 'product',
    name: '商品攝影',
    description: '產品、餐飲、空間情境拍攝，凸顯質感與細節。',
    image: productPhotos[0],
  },
  {
    key: 'event',
    name: '商業廣告',
    description: '形象廣告、活動主視覺與品牌素材的完整拍攝。',
    image: adPhotos[3],
  },
  {
    key: 'video',
    name: '形象寫真',
    description: '個人品牌與形象寫真，呈現專業而有溫度的一面。',
    image: brandingPhotos[0],
  },
]

/** 拍攝流程（婚紗婚禮） */
export const weddingProcess: ProcessStep[] = [
  { step: '01', title: '預約諮詢', description: '了解你的需求、風格偏好與重要時程，給予專業建議。', icon: 'chat' },
  { step: '02', title: '風格規劃', description: '共同確認場景、造型與拍攝主軸，準備拍攝清單。', icon: 'plan' },
  { step: '03', title: '正式拍攝', description: '在輕鬆的氛圍中引導，捕捉自然而動人的瞬間。', icon: 'camera' },
  { step: '04', title: '精修交付', description: '精選並細修影像，以線上相簿與成品交付作品。', icon: 'deliver' },
]

/** 服務流程（商業攝影） */
export const commercialProcess: ProcessStep[] = [
  { step: '01', title: '需求訪談', description: '釐清品牌定位、用途與視覺目標，訂定拍攝方向。', icon: 'chat' },
  { step: '02', title: '提案企劃', description: '提供分鏡、場景與報價，確認交付規格與時程。', icon: 'plan' },
  { step: '03', title: '拍攝執行', description: '專業團隊現場執行，確保畫面品質與效率。', icon: 'camera' },
  { step: '04', title: '後製交付', description: '依用途調色與輸出，提供多平台適用的成品。', icon: 'deliver' },
]

/** 婚紗婚禮・方案 */
export const weddingPlans: Plan[] = [
  {
    name: '小資方案',
    price: 'NT$ 12,000',
    description: '人來就拍・小資方案',
    features: [
      '雙人，一套造型',
      '彩妝師、攝影師服務',
      '拍攝約 3.5 小時（含梳化）',
      '台北市區為主，外縣市另收車資',
      '',
      '精修電子檔 10 張（加選一張 $500）',
      '打卡分享折 $500（自尾款扣除）',
      '訂金 > 搶先看照3張 > 帳號公開打卡分享文',
      '確認 > 尾款扣$500，付清 > 交付全部圖檔',

    ],
  },
  {
    name: '經典方案',
    price: 'NT$ 38,800',
    description: '經典全天婚紗體驗',
    features: [
      '女生禮服：一白一晚',
      '妝髮造型 2 套',
      '男士西裝基本款 1 套',
      '全天 6 小時',
      '',
      '精修 20 張入 A4 紀念相本',
      '90×60cm 無框畫',
      '謝卡 1 組（正反面共 200 張）',
      '打卡標記，毛片全贈',
    ],
    // featured: true,
  },
  {
    name: '豪華方案',
    price: 'NT$ 48,000',
    description: '更多造型與成品的完整方案',
    features: [
      '女生禮服：一白兩晚',
      '妝髮造型 3 套',
      '男士西裝基本款 2 套',
      '全天 8 小時',
      '',
      '精修 30 張入 A4 紀念相本',
      '90×60cm 無框畫',
      '謝卡 2 組（每組正反面共 200 張）',
      '打卡標記，毛片全贈',
    ],
  },
]
