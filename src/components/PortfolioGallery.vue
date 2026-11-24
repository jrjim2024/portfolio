<script setup lang="ts">
import type { PortfolioItem } from '@/content/types'
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: PortfolioItem[]
    /** 固定圖片比例：婚紗 4:5 / 商業 16:10 */
    ratio?: 'portrait' | 'wide'
    /** 桌機欄數 */
    columns?: 2 | 3
    /** 瀑布流：圖片不裁切，寬度滿版、高度依比例呈現 */
    masonry?: boolean
  }>(),
  {
    ratio: 'portrait',
    columns: 3,
    masonry: false,
  },
)

const category = ref('')
const categories = computed(() => [...new Set(props.items.map(item => item.categoryLabel))])
const visibleItems = computed(() => props.items.filter(item => !category.value || item.categoryLabel === category.value))
const dialog = ref<HTMLDialogElement>()
const position = ref(0)
const active = computed(() => visibleItems.value[position.value])

function openImage(index: number) {
  position.value = index
  dialog.value?.showModal()
}

function step(direction: number) {
  const length = visibleItems.value.length
  if (length > 1) position.value = (position.value + length + direction) % length
}
</script>

<template>
  <div v-if="categories.length > 1" class="mb-6 flex flex-wrap gap-2" role="group" aria-label="作品分類">
    <button
      v-for="label in ['', ...categories]"
      :key="label"
      type="button"
      :aria-pressed="category === label"
      class="rounded-full border border-line px-4 py-2 text-sm transition-colors"
      :class="category === label ? 'bg-primary text-background' : 'hover:border-accent'"
      @click="category = label"
    >{{ label || '全部作品' }}</button>
  </div>
  <!-- 瀑布流：保留原始比例，不裁切 -->
  <div
    v-if="masonry"
    class="gap-5 [column-gap:1.25rem] sm:[column-gap:1.5rem]"
    :class="columns === 2 ? 'columns-1 sm:columns-2' : 'columns-1 sm:columns-2 lg:columns-3'"
  >
    <figure
      v-for="(item, i) in visibleItems"
      :key="item.id"
      v-reveal="(i % 3) * 0.1"
      class="reveal media group relative mb-5 break-inside-avoid sm:mb-6"
    >
      <img
        :src="item.image"
        :alt="item.title"
        loading="lazy"
        class="block h-auto w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <button type="button" class="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        :aria-label="`放大${item.title}，第 ${i + 1} 張`" @click="openImage(i)" />
      <figcaption
        class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/75 via-primary/10 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <p class="text-[0.7rem] uppercase tracking-[0.18em] text-accent-soft">
          {{ item.categoryLabel }}
        </p>
        <p class="mt-1 font-serif text-xl text-white">{{ item.title }}</p>
      </figcaption>
    </figure>
  </div>

  <!-- 固定比例網格 -->
  <div
    v-else
    class="grid gap-5 sm:gap-6"
    :class="[
      columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
    ]"
  >
    <figure
      v-for="(item, i) in visibleItems"
      :key="item.id"
      v-reveal="(i % 3) * 0.1"
      class="reveal media group relative"
      :class="ratio === 'wide' ? 'aspect-[16/10]' : 'aspect-[4/5]'"
    >
      <img
        :src="item.image"
        :alt="item.title"
        loading="lazy"
        class="media-img group-hover:scale-[1.03]"
      />
      <button type="button" class="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        :aria-label="`放大${item.title}，第 ${i + 1} 張`" @click="openImage(i)" />
      <figcaption
        class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/75 via-primary/10 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <p class="text-[0.7rem] uppercase tracking-[0.18em] text-accent-soft">
          {{ item.categoryLabel }}
        </p>
        <p class="mt-1 font-serif text-xl text-white">{{ item.title }}</p>
      </figcaption>
    </figure>
  </div>
  <dialog ref="dialog" aria-label="攝影作品預覽"
    class="m-auto w-[min(94vw,70rem)] rounded-2xl bg-primary p-4 text-background backdrop:bg-black/75 sm:p-6"
    @keydown.left.prevent="step(-1)" @keydown.right.prevent="step(1)" @click.self="dialog?.close()">
    <div v-if="active">
      <div class="mb-3 flex items-center justify-between gap-4">
        <p aria-live="polite">{{ active.title }} · {{ position + 1 }} / {{ visibleItems.length }}</p>
        <button type="button" autofocus class="rounded-full border border-white/40 px-4 py-2" @click="dialog?.close()">關閉</button>
      </div>
      <img :src="active.image" :alt="active.title" class="mx-auto h-[min(66dvh,48rem)] w-full object-contain" />
      <div v-if="visibleItems.length > 1" class="mt-4 flex justify-between">
        <button type="button" class="rounded-full border border-white/40 px-4 py-2" @click="step(-1)">上一張</button>
        <button type="button" class="rounded-full border border-white/40 px-4 py-2" @click="step(1)">下一張</button>
      </div>
    </div>
  </dialog>
</template>
