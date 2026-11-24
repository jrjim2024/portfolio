<script setup lang="ts">
import { ref } from 'vue'
import { cmsRequest } from '@/content/localCms'

defineOptions({ name: 'ContentFields' })
const props = defineProps<{ modelValue: unknown; label: string; editableList?: boolean; canUpload?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: unknown]; 'uploading': [delta: number] }>()
const uploading = ref(false)
const uploadError = ref('')
const names: Record<string, string> = {
  image: '圖片', title: '標題', description: '說明', subtitle: '副標題', eyebrow: '小標',
  name: '名稱', quote: '引言', price: '價格', unit: '價格單位', features: '方案內容',
  featured: '推薦方案', categoryLabel: '分類名稱', category: '分類',
  question: '問題', answer: '回答', items: '項目', paragraphs: '段落', label: '按鈕文字',
  banner: '首圖', photographer: '攝影師', gallery: '作品', collaboration: '合作方式',
}
const hidden = new Set(['id', 'key', 'to', 'href', 'ratio', 'icon', 'group'])
function updateItem(index: number, value: unknown) {
  const list = [...props.modelValue as unknown[]]
  list[index] = value
  emit('update:modelValue', list)
}
function move(index: number, offset: number) {
  const list = [...props.modelValue as unknown[]]
  const [item] = list.splice(index, 1)
  list.splice(index + offset, 0, item)
  emit('update:modelValue', list)
}
function remove(index: number) {
  emit('update:modelValue', (props.modelValue as unknown[]).filter((_, i) => i !== index))
}
function add() {
  const list = props.modelValue as unknown[]
  const last = list.at(-1)
  let entry: unknown = ''
  if (props.label === '問答分類') entry = { category: '新分類', items: [{ question: '新問題', answer: '' }] }
  else if (props.label === '方案清單') entry = { name: '新方案', price: '', unit: '', description: '', features: [], featured: false }
  else if (props.label === 'items') entry = { question: '新問題', answer: '' }
  else if (last && typeof last === 'object' && 'id' in last) {
    entry = { ...last, id: crypto.randomUUID(), title: '新作品' }
  }
  emit('update:modelValue', [...list, entry])
}
function caption(item: unknown, index: number) {
  if (item && typeof item === 'object') {
    const fields = item as Record<string, unknown>
    return fields.question || fields.name || fields.title || fields.category || '項目 ' + (index + 1)
  }
  return '項目 ' + (index + 1)
}
async function upload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  emit('uploading', 1)
  uploadError.value = ''
  try {
    const result = await cmsRequest<{ url: string }>('upload', file)
    emit('update:modelValue', result.url)
  } catch (error) { uploadError.value = (error as Error).message }
  finally { uploading.value = false; emit('uploading', -1); input.value = '' }
}
</script>

<template>
  <div v-if="label === 'image' && typeof modelValue === 'string'" class="grid gap-2">
    <span class="font-medium">圖片</span>
    <img v-if="modelValue" :src="modelValue" alt="目前圖片" class="max-h-36 max-w-full rounded-lg object-contain object-left" />
    <label v-if="canUpload" class="text-sm">更換圖片 <input type="file" accept="image/jpeg,image/png,image/webp" :disabled="uploading" @change="upload" /></label>
    <p v-if="uploading" role="status">圖片上傳中…</p>
    <p v-if="uploadError" role="alert" class="text-red-800">{{ uploadError }}</p>
  </div>
  <label v-else-if="typeof modelValue === 'string'" class="grid gap-1">
    <span class="text-sm font-medium">{{ names[label] ?? label }}</span>
    <textarea :value="modelValue" :rows="['answer','description','quote'].includes(label) || modelValue.length > 65 ? 4 : 1"
      maxlength="6000" class="rounded-lg border border-line bg-white px-3 py-2"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
  </label>
  <label v-else-if="typeof modelValue === 'boolean'" class="flex items-center gap-2">
    <input type="checkbox" :checked="modelValue" @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
    {{ names[label] ?? label }}
  </label>
  <div v-else-if="Array.isArray(modelValue)" class="grid gap-3">
    <div v-for="(item, i) in modelValue" :key="i" class="rounded-lg border border-line p-3">
      <div v-if="editableList" class="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <strong>{{ caption(item, i) }}</strong>
        <div class="flex gap-2">
          <button type="button" class="rounded border border-line px-2 disabled:opacity-40" :disabled="i === 0" @click="move(i, -1)">上移</button>
          <button type="button" class="rounded border border-line px-2 disabled:opacity-40" :disabled="i === modelValue.length - 1" @click="move(i, 1)">下移</button>
          <button type="button" class="rounded border border-line px-2 text-red-800 disabled:opacity-40" :disabled="modelValue.length <= 1 && label !== 'features'" @click="remove(i)">移除</button>
        </div>
      </div>
      <ContentFields :label="typeof item === 'string' ? '項目 ' + (i + 1) : ''" :model-value="item"
        :can-upload="canUpload" :editable-list="editableList" @update:model-value="updateItem(i, $event)" @uploading="emit('uploading', $event)" />
    </div>
    <button v-if="editableList" type="button" class="justify-self-start rounded-lg border border-line px-3 py-2" @click="add">新增{{ names[label] ?? '項目' }}</button>
  </div>
  <div v-else-if="modelValue && typeof modelValue === 'object'" class="grid gap-4">
    <template v-for="(value, key) in (modelValue as Record<string, unknown>)" :key="key">
      <div v-if="!hidden.has(key) && !(key === 'category' && 'id' in (modelValue as object))">
        <p v-if="value && typeof value === 'object'" class="mb-2 font-medium">{{ names[key] ?? key }}</p>
        <ContentFields :label="key" :model-value="value"
          :can-upload="canUpload" :editable-list="editableList && (key === 'items' || key === 'features')"
          @update:model-value="emit('update:modelValue', { ...(modelValue as object), [key]: $event })"
          @uploading="emit('uploading', $event)" />
      </div>
    </template>
  </div>
</template>
