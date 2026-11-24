import type { PortfolioItem } from './types'
import { weddingPhotos, productPhotos, brandingPhotos, adPhotos } from './photos'

/**
 * 首頁・精選作品（6 組：婚紗婚禮 3 + 商業 3）。
 * 首頁圖片總量受控，避免變成圖片牆。
 */
export const featuredPortfolio: PortfolioItem[] = [
  { id: 'h1', title: '婚紗作品', category: 'prewedding', categoryLabel: '婚紗婚禮', image: weddingPhotos[12], ratio: 'portrait' },
  { id: 'h2', title: '婚禮紀錄', category: 'wedding', categoryLabel: '婚紗婚禮', image: weddingPhotos[26], ratio: 'portrait' },
  { id: 'h3', title: '情侶寫真', category: 'couple', categoryLabel: '婚紗婚禮', image: weddingPhotos[49], ratio: 'portrait' },
  { id: 'h4', title: '品牌形象', category: 'brand', categoryLabel: '商業攝影', image: brandingPhotos[2], ratio: 'portrait' },
  { id: 'h5', title: '產品情境', category: 'commercial', categoryLabel: '商業攝影', image: productPhotos[5], ratio: 'portrait' },
  { id: 'h6', title: '商業廣告', category: 'commercial', categoryLabel: '商業攝影', image: adPhotos[5], ratio: 'portrait' },
]

/* ----------------------- 婚紗婚禮・四類代表作品（各 3 張） ----------------------- */
export const bridalPortfolio: PortfolioItem[] = [
  { id: 'b1', title: '婚紗作品', category: 'prewedding', categoryLabel: '婚紗', image: weddingPhotos[12], ratio: 'portrait' },
  { id: 'b2', title: '婚紗作品', category: 'prewedding', categoryLabel: '婚紗', image: weddingPhotos[11], ratio: 'portrait' },
  { id: 'b3', title: '婚紗作品', category: 'prewedding', categoryLabel: '婚紗', image: weddingPhotos[40], ratio: 'portrait' },
]

export const ceremonyPortfolio: PortfolioItem[] = [
  { id: 'c1', title: '婚禮紀錄', category: 'wedding', categoryLabel: '婚禮', image: weddingPhotos[3], ratio: 'portrait' },
  { id: 'c2', title: '婚禮紀錄', category: 'wedding', categoryLabel: '婚禮', image: weddingPhotos[8], ratio: 'portrait' },
  { id: 'c3', title: '婚禮紀錄', category: 'wedding', categoryLabel: '婚禮', image: weddingPhotos[1], ratio: 'portrait' },
]

export const portraitPortfolio: PortfolioItem[] = [
  { id: 'p1', title: '結婚登記', category: 'portrait', categoryLabel: '登記', image: weddingPhotos[20], ratio: 'portrait' },
  { id: 'p2', title: '結婚登記', category: 'portrait', categoryLabel: '登記', image: weddingPhotos[39], ratio: 'portrait' },
  { id: 'p3', title: '結婚登記', category: 'portrait', categoryLabel: '登記', image: weddingPhotos[44], ratio: 'portrait' },
]

export const couplePortfolio: PortfolioItem[] = [
  { id: 'cp1', title: '情侶寫真', category: 'couple', categoryLabel: '寫真', image: weddingPhotos[29], ratio: 'portrait' },
  { id: 'cp2', title: '情侶寫真', category: 'couple', categoryLabel: '寫真', image: '/images/restored/wedding-60.jpg', ratio: 'portrait' },
  { id: 'cp3', title: '情侶寫真', category: 'couple', categoryLabel: '寫真', image: '/images/restored/wedding-52.jpg', ratio: 'portrait' },
]

/* ----------------------- 商業攝影・案例展示 ----------------------- */
export const commercialPortfolio: PortfolioItem[] = [
  { id: 'm1', title: '商業廣告', category: 'commercial', categoryLabel: '廣告', image: adPhotos[0], ratio: 'landscape' },
  { id: 'm2', title: '品牌形象', category: 'brand', categoryLabel: '形象', image: brandingPhotos[2], ratio: 'landscape' },
  { id: 'm3', title: '商品攝影', category: 'commercial', categoryLabel: '商品', image: productPhotos[1], ratio: 'landscape' },
  { id: 'm4', title: '商業廣告', category: 'commercial', categoryLabel: '廣告', image: adPhotos[1], ratio: 'landscape' },
  { id: 'm5', title: '形象照', category: 'brand', categoryLabel: '形象', image: brandingPhotos[3], ratio: 'landscape' },
  { id: 'm6', title: '商品攝影', category: 'commercial', categoryLabel: '商品', image: productPhotos[2], ratio: 'landscape' },
  ...[5, 6, 7].flatMap(index => ([
    { id: `ad-${index}`, title: '商業廣告', category: 'commercial', categoryLabel: '廣告', image: adPhotos[index], ratio: 'landscape' },
    { id: `brand-${index}`, title: '品牌形象', category: 'brand', categoryLabel: '形象', image: brandingPhotos[index], ratio: 'landscape' },
    { id: `product-${index}`, title: '商品攝影', category: 'commercial', categoryLabel: '商品', image: productPhotos[index], ratio: 'landscape' },
  ] satisfies PortfolioItem[])),
]
