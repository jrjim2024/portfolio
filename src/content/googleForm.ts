/**
 * Google 表單（Forms）送出設定。
 *
 * 建立表單欄位請對齊聯絡頁：姓名、電話、Email、諮詢項目、期望日期、訊息內容。
 * 取得方式：
 * 1. 開啟表單 → 右上角「傳送」→ 複製連結（含 /viewform）
 * 2. 將網址中的 /viewform 改成 /formResponse，填入 VITE_GOOGLE_FORM_ACTION
 * 3. 在瀏覽器對表單「檢視原始碼」，搜尋 name="entry.数字"，對應各欄位填入下方 ENTRY
 *
 * 亦可於 Vercel → Settings → Environment Variables 設定相同變數後重新部署。
 */
const env = import.meta.env

export const googleForm = {
  /** 例如 https://docs.google.com/forms/d/e/XXXX/formResponse */
  action: (env.VITE_GOOGLE_FORM_ACTION || '').trim(),
  entries: {
    name: (env.VITE_GOOGLE_FORM_ENTRY_NAME || '').trim(),
    phone: (env.VITE_GOOGLE_FORM_ENTRY_PHONE || '').trim(),
    email: (env.VITE_GOOGLE_FORM_ENTRY_EMAIL || '').trim(),
    type: (env.VITE_GOOGLE_FORM_ENTRY_TYPE || '').trim(),
    date: (env.VITE_GOOGLE_FORM_ENTRY_DATE || '').trim(),
    message: (env.VITE_GOOGLE_FORM_ENTRY_MESSAGE || '').trim(),
  },
} as const

export type GoogleFormField = keyof typeof googleForm.entries

export function isGoogleFormConfigured(): boolean {
  const { action, entries } = googleForm
  return Boolean(
    !env.DEV &&
      action &&
      entries.name &&
      entries.phone &&
      entries.email &&
      entries.type &&
      entries.date &&
      entries.message,
  )
}
