export const roleLabels = { admin: '管理者', owner: '老闆', lead: '組長', employee: '員工' } as const
export const accessLabels = { preview: '檢視草稿與預覽', edit: '編輯並儲存內容', upload: '上傳圖片', publish: '發布內容', restore: '回復上一版本' } as const
export type Role = keyof typeof roleLabels
export type Access = keyof typeof accessLabels
export type Account = { username: string; role: Role; access: Access[]; enabled: boolean }
export const accessKeys = Object.keys(accessLabels) as Access[]
export const rank: Record<Role, number> = { admin: 4, owner: 3, lead: 2, employee: 1 }
export const canManage = (actor: Role, target: Role) => rank[actor] > rank[target]
