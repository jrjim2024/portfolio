<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import ContentFields from '@/components/ContentFields.vue'
import AccountManager from '@/components/AccountManager.vue'
import { accessLabels, roleLabels, type Access, type Account } from '@/content/cmsAccess'
import { cmsRequest, mapContentAssets, originalContent, type Content } from '@/content/localCms'

type State = { draft: Content | null; published: Content | null; previous: Content | null; publishedAt: string | null; canPublishDraft: boolean; canRestore: boolean; revision: number }
const state = ref<State>()
const editor = ref<Content>({})
const signedIn = ref(false)
const actor = ref<Account>()
const username = ref('')
const password = ref('')
const mfa = ref<{ challenge: string; enrollmentKey?: string }>()
const mfaCode = ref('')
const recovery = ref<string[]>([])
const conflict = ref(false)
const backups = ref<{ id: string; createdAt: string }[]>([])
const audit = ref<{ time: string; actor: string; action: string; detail: { before?: Account; after?: Account; id?: string; revision?: number; passwordReset?: boolean } }[]>([])
const actionLabels: Record<string, string> = { 'accounts.change': '帳號與權限變更', 'content.publish': '發布內容', 'content.rollback': '回復發布版本', 'backup.create': '建立備份', 'backup.restore': '還原備份' }
const formatTime = (value: string) => new Date(value).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
const currentPassword = ref('')
const nextPassword = ref('')
const tabs = { content: '內容編輯', accounts: '帳號與權限管理', password: '變更密碼', security: '備份與操作紀錄' } as const
const tab = ref<keyof typeof tabs>('content')
const allow = (key: Access) => actor.value?.access.includes(key) ?? false
const busy = ref(false)
const uploads = ref(0)
const baseline = ref('')
const notice = ref('')
const error = ref('')
const selected = ref('首頁')
const dirty = computed(() => JSON.stringify(editor.value) !== baseline.value)
const pages: Record<string, string> = { 首頁: '/', 婚紗婚禮: '/wedding', 商業攝影: '/commercial', 關於與聯絡: '/about', 作品圖片: '/commercial', 常見問題: '/faq', 婚紗方案: '/wedding' }
const date = computed(() => state.value?.publishedAt ? new Intl.DateTimeFormat('zh-TW', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Taipei',
}).format(new Date(state.value.publishedAt)) : '')
function fill(data: State) {
  state.value = data
  conflict.value = false
  editor.value = mapContentAssets(data.draft ?? data.published ?? originalContent, 'load')
  baseline.value = JSON.stringify(editor.value)
}
async function run(task: () => Promise<void>) {
  if (busy.value || uploads.value) return
  busy.value = true
  notice.value = ''
  error.value = ''
  try { await task() }
  catch (cause) { error.value = (cause as Error).message }
  finally { busy.value = false }
}
async function login() {
  await run(async () => {
    const result = await cmsRequest<{ challenge?: string; enrollmentKey?: string }>('login', JSON.stringify({ username: username.value, password: password.value }))
    password.value = ''
    if (result.challenge) {
      mfa.value = { challenge: result.challenge, enrollmentKey: result.enrollmentKey }
      return
    }
    await loadAccount()
  })
}
async function verifyMfa() {
  await run(async () => {
    const result = await cmsRequest<{ recoveryCodes?: string[] }>('mfa', JSON.stringify({ challenge: mfa.value?.challenge, code: mfaCode.value.trim() }))
    mfa.value = undefined
    mfaCode.value = ''
    recovery.value = result.recoveryCodes ?? []
    await loadAccount()
  })
}
async function logout() {
  if (dirty.value && !window.confirm('目前有未儲存的修改。確定要登出？')) return
  await run(async () => {
    await cmsRequest('logout', '')
    recovery.value = []
    signedIn.value = false
    actor.value = undefined
    tab.value = 'content'
    state.value = undefined
    editor.value = {}
  })
}
async function loadAccount() {
  actor.value = await cmsRequest<Account>('me')
  fill(await cmsRequest<State>('state'))
  signedIn.value = true
}
async function changePassword() {
  await run(async () => {
    await cmsRequest('password', JSON.stringify({ currentPassword: currentPassword.value, nextPassword: nextPassword.value }))
    currentPassword.value = ''
    nextPassword.value = ''
    notice.value = '密碼已更新。'
  })
}
function selectTab(value: typeof tab.value) {
  tab.value = value
  notice.value = ''
  error.value = ''
  if (value === 'security') void run(loadSecurity)
}
async function loadSecurity() {
  const [savedBackups, history] = await Promise.all([
    cmsRequest<typeof backups.value>('backups'), cmsRequest<typeof audit.value>('audit'),
  ])
  backups.value = savedBackups
  audit.value = history
}
async function makeBackup() {
  await run(async () => {
    await cmsRequest('backup', '{}')
    await loadSecurity()
    notice.value = '備份已建立。'
  })
}
async function restoreBackup(id: string) {
  if (!window.confirm('要用這份備份還原草稿與公開內容嗎？伺服器會先備份目前版本。')) return
  await run(async () => {
    await updateContent('backup-restore', { id })
    await loadSecurity()
    notice.value = '備份已還原。'
  })
}
async function updateContent(action: string, data: Record<string, unknown> = {}) {
  try {
    fill(await cmsRequest<State>(action, JSON.stringify({ ...data, revision: state.value?.revision })))
  } catch (cause) {
    if ((cause as { status?: number }).status === 409) conflict.value = true
    throw cause
  }
}
async function reloadContent() {
  if (dirty.value && !window.confirm('載入最新版會清除目前尚未儲存的編輯。確定載入？')) return
  await run(async () => { fill(await cmsRequest<State>('state')); notice.value = '已載入最新版。' })
}
async function save() {
  await run(async () => {
    await updateContent('draft', { content: mapContentAssets(editor.value, 'save') })
    notice.value = '草稿已儲存。'
  })
}
async function publish() {
  await run(async () => {
    await updateContent('publish')
    notice.value = '已發布。重新整理前台即可看到更新。'
  })
}
async function restore() {
  if (!window.confirm('確定要回復上一個公開版本？草稿會保留。')) return
  await run(async () => {
    await updateContent('restore')
    notice.value = '已回復上一個公開版本。'
  })
}
onMounted(async () => {
  try {
    await loadAccount()
  } catch (cause) {
    if ((cause as Error).message !== '請先登入後台。') error.value = (cause as Error).message
  }
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 py-12 sm:px-8">
    <header class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="eyebrow mb-2">Demi Studio</p>
        <h1 class="text-3xl font-semibold sm:text-4xl">後台系統</h1>
      </div>
      <div class="flex flex-wrap gap-2">
        <BaseButton href="/" variant="outline">查看前台</BaseButton>
        <BaseButton v-if="signedIn" variant="outline" :disabled="busy || uploads > 0" @click="logout">登出</BaseButton>
      </div>
    </header>

    <form v-if="!signedIn && mfa" class="max-w-lg space-y-5 rounded-2xl border border-line bg-soft p-6" @submit.prevent="verifyMfa">
      <h2 class="text-xl font-semibold">{{ mfa.enrollmentKey ? '設定管理員雙重驗證' : '管理員雙重驗證' }}</h2>
      <p v-if="mfa.enrollmentKey">在驗證器 App 新增「時間型」帳號，手動輸入下方金鑰，再填入 App 顯示的六位數驗證碼。</p>
      <input v-if="mfa.enrollmentKey" :value="mfa.enrollmentKey" readonly aria-label="驗證器金鑰" class="w-full rounded border border-line bg-white px-3 py-2 font-mono" />
      <label class="grid gap-2">驗證碼
        <input v-model="mfaCode" required autocomplete="one-time-code" class="rounded border border-line bg-white px-3 py-2" />
      </label>
      <p v-if="!mfa.enrollmentKey" class="text-sm text-muted">也可輸入尚未使用的復原碼。</p>
      <BaseButton type="submit" :disabled="busy">驗證登入</BaseButton>
      <BaseButton variant="outline" @click="mfa = undefined; mfaCode = ''; error = ''">返回登入</BaseButton>
      <p v-if="error" role="alert" class="text-red-800">{{ error }}</p>
    </form>
    <form v-else-if="!signedIn" class="max-w-md space-y-5 rounded-2xl border border-line bg-soft p-6" @submit.prevent="login">
      <label class="grid gap-2 font-medium">後台帳號
        <input v-model="username" type="text" autocomplete="username" required class="rounded-lg border border-line bg-white px-3 py-2" />
      </label>
      <label class="grid gap-2 font-medium">後台密碼
        <input v-model="password" type="password" autocomplete="current-password" required class="rounded-lg border border-line bg-white px-3 py-2" />
      </label>
      <BaseButton type="submit" :disabled="busy">登入</BaseButton>
      <p v-if="error" role="alert" class="text-red-800">{{ error }}</p>
    </form>

    <template v-else-if="actor">
      <section v-if="recovery.length" class="mb-6 space-y-3 rounded-xl border border-line bg-soft p-5">
        <h2 class="text-xl font-semibold">管理員復原碼</h2>
        <p>每組可使用一次。請立即保存到安全位置，這些代碼只在設定完成時顯示。</p>
        <ul class="grid gap-2 font-mono sm:grid-cols-2"><li v-for="code in recovery" :key="code">{{ code }}</li></ul>
        <BaseButton variant="outline" @click="recovery = []">我已保存復原碼</BaseButton>
      </section>
      <p class="mb-4 text-sm text-muted">{{ actor.username }} · {{ roleLabels[actor.role] }}</p>
      <nav class="mb-6 flex flex-wrap gap-2" aria-label="後台功能">
        <template v-for="(label, key) in tabs" :key="key">
          <button v-if="(key !== 'accounts' || actor.role !== 'employee') && (key !== 'security' || actor.role === 'admin')" type="button"
            class="btn border transition-colors"
            :class="tab === key ? 'border-primary bg-primary text-white' : 'border-line text-primary hover:border-primary hover:bg-soft'"
            :aria-pressed="tab === key" @click="selectTab(key)">{{ label }}</button>
        </template>
      </nav>
      <h2 class="mb-4 text-xl font-semibold">{{ tabs[tab] }}</h2>
      <AccountManager v-if="tab === 'accounts'" :actor="actor" />
      <section v-else-if="tab === 'security'" class="grid gap-6">
        <div class="space-y-3 rounded-xl border border-line bg-soft p-5">
          <h3 class="text-lg font-semibold">網站內容與圖片備份</h3>
          <p class="text-sm text-muted">還原會恢復草稿、公開內容與圖片，並保留目前帳號權限和操作紀錄。</p>
          <BaseButton :disabled="busy" @click="makeBackup">建立備份</BaseButton>
          <ul v-if="backups.length" class="divide-y divide-line">
            <li v-for="backup in backups" :key="backup.id" class="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>{{ formatTime(backup.createdAt) }}</span>
              <BaseButton variant="outline" :disabled="busy || dirty" @click="restoreBackup(backup.id)">還原這份備份</BaseButton>
            </li>
          </ul>
          <p v-else class="text-sm text-muted">目前沒有備份。</p>
          <p v-if="dirty" class="text-sm text-muted">請先儲存或放棄尚未儲存的編輯，再還原備份。</p>
        </div>
        <div class="space-y-3 rounded-xl border border-line bg-soft p-5">
          <h3 class="text-lg font-semibold">最近操作紀錄</h3>
          <BaseButton variant="outline" :disabled="busy" @click="run(loadSecurity)">重新整理紀錄</BaseButton>
          <p v-if="!audit.length" class="text-sm text-muted">目前沒有操作紀錄。</p>
          <ul class="divide-y divide-line">
            <li v-for="(entry, index) in audit" :key="index" class="grid gap-1 py-3">
              <strong>{{ actionLabels[entry.action] ?? entry.action }}</strong>
              <span class="text-sm">{{ formatTime(entry.time) }} · {{ entry.actor }}</span>
              <span v-if="entry.detail.after" class="text-sm">
                {{ entry.detail.after.username }} · {{ roleLabels[entry.detail.after.role] }} · {{ entry.detail.after.enabled ? '啟用' : '停用' }}
                <br />權限 {{ entry.detail.before?.access.map(key => accessLabels[key]).join('、') || '無' }}
                → {{ entry.detail.after.access.map(key => accessLabels[key]).join('、') || '無' }}
                <span v-if="entry.detail.passwordReset"> · 已重設密碼</span>
              </span>
              <span v-if="entry.detail.revision" class="text-sm text-muted">版本 {{ entry.detail.revision }}</span>
            </li>
          </ul>
        </div>
        <p v-if="notice" role="status" class="text-green-800">{{ notice }}</p>
        <p v-if="error" role="alert" class="text-red-800">{{ error }}</p>
        <BaseButton v-if="conflict" variant="outline" :disabled="busy" @click="reloadContent">載入最新版</BaseButton>
      </section>
      <form v-else-if="tab === 'password'" class="grid max-w-md gap-4 rounded-xl border border-line bg-soft p-5" @submit.prevent="changePassword">
        <label class="grid gap-1">目前密碼
          <input v-model="currentPassword" type="password" required autocomplete="current-password" class="rounded border border-line bg-white px-3 py-2" />
        </label>
        <label class="grid gap-1">新密碼
          <input v-model="nextPassword" type="password" required :minlength="actor.role === 'admin' ? undefined : 12"
            :maxlength="actor.role === 'admin' ? undefined : 128" autocomplete="new-password" class="rounded border border-line bg-white px-3 py-2" />
        </label>
        <BaseButton type="submit" :disabled="busy">儲存新密碼</BaseButton>
        <p v-if="notice" role="status" class="text-green-800">{{ notice }}</p>
        <p v-if="error" role="alert" class="text-red-800">{{ error }}</p>
      </form>
      <template v-else>
      <div class="sticky top-0 z-10 mb-6 grid gap-3 border-b border-line bg-background py-4">
        <div class="flex flex-wrap gap-3">
          <BaseButton v-if="allow('edit')" :disabled="busy || uploads > 0" @click="save">儲存草稿</BaseButton>
          <a v-if="allow('preview') && !dirty" :href="pages[selected] + '?preview=1'" target="_blank" rel="noopener"
            class="btn border border-line text-primary hover:bg-soft">預覽草稿</a>
          <BaseButton v-if="allow('publish')" :disabled="busy || uploads > 0 || dirty || !state?.canPublishDraft" @click="publish">發布到前台</BaseButton>
          <BaseButton v-if="allow('restore') && state?.canRestore" variant="outline" :disabled="busy || uploads > 0" @click="restore">回復上一版本</BaseButton>
        </div>
        <p v-if="notice" role="status" class="text-green-800">{{ notice }}</p>
        <p v-if="error" role="alert" class="text-red-800">{{ error }}</p>
        <p class="text-sm text-muted">{{ dirty ? '有未儲存的修改。請先儲存，再預覽或發布。' : date ? '最近發布 ' + date : '目前公開頁面使用專案預設內容。' }}</p>
        <BaseButton v-if="conflict" variant="outline" :disabled="busy" @click="reloadContent">載入最新版</BaseButton>
      </div>

      <div v-if="allow('edit') || allow('preview')" class="mb-6 flex flex-wrap gap-2" role="group" aria-label="編輯區域">
        <button v-for="section in Object.keys(originalContent)" :key="section" type="button"
          :aria-pressed="selected === section" :disabled="uploads > 0" class="rounded-full border border-line px-4 py-2"
          :class="selected === section ? 'bg-primary text-white' : 'hover:bg-soft'" @click="selected = section">{{ section }}</button>
      </div>
      <fieldset v-if="allow('edit') || allow('preview')" :key="selected" :disabled="!allow('edit') || busy" class="grid gap-3">
        <details v-for="(content, key) in editor[selected]" :key="key" class="rounded-xl border border-line bg-soft">
          <summary class="px-4 py-4 font-medium">{{ key }}</summary>
          <div class="px-4 pb-5">
            <ContentFields :label="key" :model-value="content" :can-upload="allow('upload')" :editable-list="['作品圖片','常見問題','婚紗方案'].includes(selected)"
              @update:model-value="editor[selected][key] = $event" @uploading="uploads += $event" />
          </div>
        </details>
      </fieldset>
      <p v-else class="text-muted">此帳號沒有草稿瀏覽或編輯權限。</p>
      </template>
    </template>
  </section>
</template>
