<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { accessKeys, accessLabels, canManage, roleLabels, type Access, type Account, type Role } from '@/content/cmsAccess'
import { cmsRequest } from '@/content/localCms'

const props = defineProps<{ actor: Account }>()
const records = ref<Account[]>([])
const creating = ref(true)
const busy = ref(false)
const notice = ref('')
const error = ref('')
const roles = (Object.keys(roleLabels) as Role[]).filter(role => canManage(props.actor.role, role))
const form = reactive({ username: '', role: roles.at(-1) ?? 'employee', access: [] as Access[], enabled: true, password: '' })
const active = computed(() => records.value.find(account => account.username === form.username))
const canReset = computed(() => creating.value || (active.value?.access.every(key => props.actor.access.includes(key)) ?? false))

function select(record?: Account) {
  creating.value = !record
  notice.value = ''
  error.value = ''
  Object.assign(form, record ? { ...record, access: [...record.access], password: '' } : {
    username: '', role: roles.at(-1) ?? 'employee', access: [], enabled: true, password: '',
  })
}
async function save() {
  if (busy.value) return
  busy.value = true
  notice.value = ''
  error.value = ''
  try {
    const result = await cmsRequest<Account[]>('accounts', JSON.stringify({ ...form, create: creating.value }))
    records.value = result
    select(result.find(account => account.username === form.username.trim().toLowerCase()))
    notice.value = '帳號與操作權限已儲存。'
  } catch (cause) { error.value = (cause as Error).message }
  finally { busy.value = false }
}
onMounted(async () => {
  try { records.value = await cmsRequest<Account[]>('accounts') }
  catch (cause) { error.value = (cause as Error).message }
})
</script>

<template>
  <section class="grid gap-6 md:grid-cols-[1fr_2fr]">
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">帳號與權限</h2>
      <button type="button" class="btn bg-primary text-white" @click="select()">新增帳號</button>
      <p v-if="!records.length" class="text-muted">目前沒有可管理的帳號。</p>
      <ul class="grid gap-2">
        <li v-for="account in records" :key="account.username">
          <button type="button" class="w-full rounded-xl border px-4 py-3 text-left transition-colors"
            :class="!creating && form.username === account.username ? 'border-primary bg-primary text-white' : 'border-line hover:border-primary hover:bg-soft'"
            :aria-pressed="!creating && form.username === account.username" @click="select(account)">
            {{ account.username }} · {{ roleLabels[account.role] }} · {{ account.enabled ? '啟用' : '停用' }}
          </button>
        </li>
      </ul>
    </div>
    <form class="grid gap-4 rounded-xl border border-line bg-soft p-5" @submit.prevent="save">
      <h3 class="text-lg font-medium">{{ creating ? '新增帳號' : '編輯帳號' }}</h3>
      <label class="grid gap-1">帳號
        <input v-model="form.username" :readonly="!creating" required autocomplete="off" maxlength="32" class="rounded border border-line bg-white px-3 py-2" />
      </label>
      <label class="grid gap-1">角色
        <select v-model="form.role" :disabled="!creating" class="rounded border border-line bg-white px-3 py-2">
          <option v-for="role in roles" :key="role" :value="role">{{ roleLabels[role] }}</option>
        </select>
      </label>
      <label v-if="canReset" class="grid gap-1">{{ creating ? '初始密碼' : '重設密碼（選填）' }}
        <input v-model="form.password" type="password" autocomplete="new-password" :required="creating" minlength="12" maxlength="128" class="rounded border border-line bg-white px-3 py-2" />
      </label>
      <label class="flex items-center gap-2"><input v-model="form.enabled" type="checkbox" /> 啟用帳號</label>
      <fieldset class="space-y-2">
        <legend class="mb-2 font-medium">操作權限</legend>
        <label v-for="key in accessKeys" :key="key" class="flex items-center gap-2">
          <input v-model="form.access" type="checkbox" :value="key" :disabled="!actor.access.includes(key)" />
          {{ accessLabels[key] }}
        </label>
      </fieldset>
      <button type="submit" :disabled="busy" class="btn justify-self-start bg-primary text-white">儲存帳號與權限</button>
      <p v-if="notice" role="status" class="text-green-800">{{ notice }}</p>
      <p v-if="error" role="alert" class="text-red-800">{{ error }}</p>
    </form>
  </section>
</template>
