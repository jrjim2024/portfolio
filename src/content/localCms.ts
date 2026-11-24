import { hero, dualEntries } from './hero'
import { about } from './about'
import { weddingBanner, commercialBanner, faqBanner, contactBanner, weddingIntro, commercialIntro } from './pages'
import { imageBreaks, homeSections, weddingSections, commercialSections, defaultCta } from './sections'
import { faqCategories } from './faq'
import { weddingPlans, commercialServices } from './services'
import * as gallery from './portfolio'

export const sections = [
  { label: '首頁', fields: { 首圖: hero, 服務入口: dualEntries, 區塊標題: homeSections, 品牌引言: imageBreaks.home } },
  { label: '婚紗婚禮', fields: { 首圖: weddingBanner, 服務介紹: weddingIntro, 區塊標題: weddingSections, 引言: imageBreaks.wedding } },
  { label: '商業攝影', fields: { 首圖: commercialBanner, 服務介紹: commercialIntro, 服務項目: commercialServices, 區塊標題: commercialSections, 品牌故事: imageBreaks.commercial } },
  { label: '關於與聯絡', fields: { 關於我們: about, 關於引言: imageBreaks.about, 聯絡頁首圖: contactBanner, 共用預約區: defaultCta } },
  { label: '作品圖片', fields: { 首頁精選: gallery.featuredPortfolio, 婚紗: gallery.bridalPortfolio, 婚禮: gallery.ceremonyPortfolio, 結婚登記: gallery.portraitPortfolio, 情侶寫真: gallery.couplePortfolio, 商業案例: gallery.commercialPortfolio } },
  { label: '常見問題', fields: { 頁首: faqBanner, 問答分類: faqCategories } },
  { label: '婚紗方案', fields: { 方案清單: weddingPlans } },
]

export type Content = Record<string, Record<string, unknown>>
export const originalContent: Content = JSON.parse(JSON.stringify(
  Object.fromEntries(sections.map(section => [section.label, section.fields])),
))

export const apiPrefix = '/api/local-cms/'
export const previewMode = new URLSearchParams(location.search).get('preview') === '1'

const assets = import.meta.glob<string>('../assets/portfolio/**/*.{jpg,jpeg,png,webp,gif}', {
  eager: true, query: '?url', import: 'default',
})
const byUrl = new Map(Object.entries(assets).map(([key, url]) => [url, 'asset:' + key]))

export function mapContentAssets(content: Content, direction: 'load' | 'save'): Content {
  function visit(value: unknown): unknown {
    if (typeof value === 'string') {
      if (direction === 'save') return byUrl.get(value) ?? value
      const key = value.startsWith('asset:') ? value.slice(6)
        : value.startsWith('/src/assets/portfolio/') ? '..' + value.slice(4) : ''
      return assets[key] ?? value
    }
    if (Array.isArray(value)) return value.map(visit)
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item)]))
    return value
  }
  return visit(content) as Content
}

export async function cmsRequest<T>(action: string, payload?: BodyInit): Promise<T> {
  const response = await fetch(apiPrefix + action, payload === undefined ? {} : {
    method: 'POST', body: payload, headers: { 'X-Demi-CMS': '1' },
  })
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('後台服務尚未啟用。')
  const result = await response.json()
  if (!response.ok) throw Object.assign(new Error(result.error || '操作失敗。'), { status: response.status })
  return result as T
}

export async function loadLocalContent() {
  if (location.pathname === '/admin') return
  try {
    const { content } = await cmsRequest<{ content: Content | null }>(previewMode ? 'preview' : 'published')
    if (!content) return
    const resolved = mapContentAssets(content, 'load')
    for (const { label, fields } of sections) {
      for (const [key, target] of Object.entries(fields)) {
        const edited = resolved[label]?.[key]
        if (Array.isArray(target) && Array.isArray(edited)) target.splice(0, target.length, ...edited)
        else if (edited && typeof edited === 'object' && !Array.isArray(edited) && !Array.isArray(target)) {
          for (const property of Object.keys(target)) {
            if (Object.hasOwn(edited, property)) Reflect.set(target, property, Reflect.get(edited, property))
          }
        }
      }
    }
  } catch (error) {
    if (previewMode) location.replace('/admin')
    else console.error('無法讀取本機已發布內容', error)
  }
}
