import { googleForm, isGoogleFormConfigured, type GoogleFormField } from '@/content/googleForm'

export type ContactFormPayload = Record<GoogleFormField, string>

/**
 * 將聯絡表單 POST 至 Google Forms。
 * 使用 mode: 'no-cors'（Google 不回傳 CORS header），無法讀取回應內容，
 * 但請求送出後資料仍會寫入表單／試算表。
 */
export async function submitGoogleForm(payload: ContactFormPayload): Promise<'demo' | 'sent'> {
  if (!isGoogleFormConfigured()) {
    return 'demo'
  }

  const body = new URLSearchParams()
  for (const field of Object.keys(googleForm.entries) as GoogleFormField[]) {
    const entryId = googleForm.entries[field]
    body.append(`entry.${entryId}`, payload[field] ?? '')
  }

  await fetch(googleForm.action, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  return 'sent'
}
