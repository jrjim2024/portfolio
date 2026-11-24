/**
 * 實拍圖庫／影庫 —— 用 Vite `import.meta.glob` 動態抓取，不寫死檔名與數量。
 *
 * 新增媒體：把檔案丟進 `src/assets/portfolio/<分類>/` 即可，重新整理／建置後自動帶入。
 * 圖片：.jpg .jpeg .png .webp .gif
 * 影片：.mp4 .webm .mov
 */

export type MediaKind = 'image' | 'video'

export interface MediaItem {
  src: string
  kind: MediaKind
}

const VIDEO_RE = /\.(mp4|webm|mov)$/i

type GlobMap = Record<string, string>

function collect(modules: GlobMap): MediaItem[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }))
    .map(([path, src]) => ({
      src,
      kind: (VIDEO_RE.test(path) ? 'video' : 'image') as MediaKind,
    }))
}

function mediaSrc(items: MediaItem[], kind: MediaKind): string[] {
  return items.filter((i) => i.kind === kind).map((i) => i.src)
}

const weddingGlob = import.meta.glob('../assets/portfolio/wedding/*.{jpg,jpeg,png,webp,gif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as GlobMap

const productGlob = import.meta.glob('../assets/portfolio/product/*.{jpg,jpeg,png,webp,gif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as GlobMap

const brandingGlob = import.meta.glob('../assets/portfolio/branding/*.{jpg,jpeg,png,webp,gif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as GlobMap

const adGlob = import.meta.glob('../assets/portfolio/ad/*.{jpg,jpeg,png,webp,gif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as GlobMap

const aboutGlob = import.meta.glob('../assets/portfolio/about/*.{jpg,jpeg,png,webp,gif,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as GlobMap

export const weddingMedia = collect(weddingGlob)
export const weddingPhotos = mediaSrc(weddingMedia, 'image')
export const weddingVideos = mediaSrc(weddingMedia, 'video')

export const productMedia = collect(productGlob)
export const productPhotos = mediaSrc(productMedia, 'image')
export const productVideos = mediaSrc(productMedia, 'video')

export const brandingMedia = collect(brandingGlob)
export const brandingPhotos = mediaSrc(brandingMedia, 'image')
export const brandingVideos = mediaSrc(brandingMedia, 'video')

export const adMedia = collect(adGlob)
export const adPhotos = mediaSrc(adMedia, 'image')
export const adVideos = mediaSrc(adMedia, 'video')

export const aboutMedia = collect(aboutGlob)
export const aboutPhotos = mediaSrc(aboutMedia, 'image')
export const aboutVideos = mediaSrc(aboutMedia, 'video')

/** 品牌 Logo（透明背景；深色字給淺底、白色字給深底） */
export const logoDark = '/images/logo/demi-studio-dark.png'
export const logoWhite = '/images/logo/demi-studio-white.png'
export const logoImage = logoDark
