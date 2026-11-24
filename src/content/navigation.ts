import type { NavRoute } from './types'

/**
 * 導覽與路由設定 —— 全站單一資料來源。
 *
 * 這份清單同時提供：
 *  1. Vue Router 產生路由（見 `src/router/index.ts`）
 *  2. Navbar / Footer 產生選單
 *  3. 各頁 SEO 的 title / description（見 `src/utils/seo.ts`）
 *
 * ⚠️ 請勿在元件內寫死導覽項目，新增頁面時只要在此加入一筆即可。
 */
export const navRoutes: NavRoute[] = [
  {
    name: 'home',
    path: '/',
    navTitle: '首頁',
    title: '德米攝影 Demi Photo Studio｜婚紗婚禮・商業攝影',
    description:
      'Demi Studio（德米攝影／Demi Photo Studio，Facebook：demiart2015）官方網站。台北婚紗攝影、輕婚紗、婚禮紀錄、結婚登記與情侶寫真、商業／品牌形象攝影。照片一半由我完成，另一半由我們一起創造。',
    showInNavbar: true,
    showInFooter: true,
  },
  {
    name: 'wedding',
    path: '/wedding',
    navTitle: '婚紗婚禮',
    title: '婚紗婚禮攝影｜德米攝影 Demi Photo Studio',
    description:
      '德米攝影 Demi Photo Studio（Demi Studio）婚紗攝影、輕婚紗、婚禮紀錄、結婚登記與情侶寫真。以自然光影記錄屬於你們的故事。粉絲專頁 @demiart2015。',
    showInNavbar: true,
    showInFooter: true,
  },
  {
    name: 'commercial',
    path: '/commercial',
    navTitle: '商業攝影',
    title: '商業與品牌攝影｜德米攝影 Demi Studio',
    description:
      'Demi Studio／德米攝影商業攝影：品牌形象、企業形象、產品攝影、活動紀錄與短影音。為品牌打造一致、有溫度的視覺語言。',
    showInNavbar: true,
    showInFooter: true,
  },
  {
    name: 'about',
    path: '/about',
    navTitle: '關於我們',
    title: '關於德米攝影 Demi Studio',
    description:
      '認識 Demi Studio／德米攝影有限公司（Demi Photo Studio）：品牌理念、攝影師背景與服務風格。官方粉絲專頁 Facebook @demiart2015。',
    showInNavbar: true,
    showInFooter: true,
  },
  {
    name: 'faq',
    path: '/faq',
    navTitle: '常見問題',
    title: '常見問題｜德米攝影 Demi Studio',
    description:
      '德米攝影 Demi Photo Studio 婚紗婚禮與商業攝影 FAQ：預約、拍攝、交件、付款、改期與授權。',
    showInNavbar: true,
    showInFooter: true,
  },
  {
    name: 'contact',
    path: '/contact',
    navTitle: '聯絡我們',
    title: '聯絡預約｜德米攝影 Demi Studio',
    description:
      '預約 Demi Studio／德米攝影（Demi Photo Studio）。電話 0907-493-168，或透過 LINE、線上表單與 Facebook @demiart2015 與我們聯繫。',
    showInNavbar: true,
    showInFooter: true,
  },
]

/** 依名稱查找路由設定 */
export function findNavRoute(name: string): NavRoute | undefined {
  return navRoutes.find((r) => r.name === name)
}

/** Navbar 顯示項目 */
export const navbarItems = navRoutes.filter((r) => r.showInNavbar)

/** Footer 顯示項目 */
export const footerItems = navRoutes.filter((r) => r.showInFooter)
