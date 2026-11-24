import type { HeroContent, DualEntry, BrandValue } from './types'
import { brand } from './brand'
import { weddingPhotos, productPhotos } from './photos'

export const hero: HeroContent = {
  eyebrow: 'Modern Editorial × Lifestyle',
  title: '光，是時間\n留下的溫度',
  subtitle: 'Photography that feels like a memory',
  description:
    '我們相信最好的照片，是讓你在多年以後翻看時，依然能感受到當下的溫度與情感。以自然的光影、克制的構圖，記錄屬於你的真實故事。',
  image: weddingPhotos[18],
  primaryCta: { label: '立即預約', to: '/contact' },
  secondaryCta: { label: '作品集', to: '/wedding' },
}

/** 首頁雙入口 */
export const dualEntries: DualEntry[] = [
  {
    key: 'wedding',
    label: 'Wedding & Love',
    title: '婚紗婚禮',
    description: '從訂婚到婚禮當日，以細膩的視角，留下兩個人最自然的樣子。',
    image: weddingPhotos[16],
    to: '/wedding',
  },
  {
    key: 'commercial',
    label: 'Brand & Business',
    title: '商業攝影',
    description: '為品牌打造具質感的視覺語言，讓影像成為最有力的溝通。',
    image: productPhotos[4],
    to: '/commercial',
  },
]

/** 品牌價值（首頁）—— 我們相信影像不只是照片，而是紀錄人生的重要片刻。 */
export const brandValues: BrandValue[] = [
  {
    icon: 'interaction',
    title: '自然互動',
    description: '以陪伴與引導取代生硬擺拍，讓鏡頭前的你自在做自己。',
  },
  {
    icon: 'emotion',
    title: '真實情感',
    description: '捕捉眼神、笑容與相處間最真實的溫度，而非完美的假象。',
  },
  {
    icon: 'quality',
    title: '經典質感',
    description: '克制的調色與編輯式構圖，成就經得起時間的影像作品。',
  },
]

export const brandValuesHeading = {
  eyebrow: 'Our Values',
  title: '影像，是人生的\n重要片刻',
  description: '我們相信照片不只是記錄，而是讓你在多年以後，依然能回到那一刻的溫度。',
}

/** 品牌理念（首頁） */
export const brandPhilosophy = {
  eyebrow: 'Our Philosophy',
  title: '照片的一半，\n由我們一起創造',
  paragraphs: [...brand.philosophy],
  image: weddingPhotos[6],
}
