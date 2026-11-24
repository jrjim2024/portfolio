<script setup lang="ts">
import { ref } from 'vue'
import type { FaqItem } from '@/content/types'

defineProps<{
  items: FaqItem[]
}>()

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="border-y border-line">
    <div v-for="(item, i) in items" :key="i" class="border-b border-line last:border-b-0">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-6 rounded-2xl px-4 py-6 text-left transition-colors duration-300 hover:bg-soft"
        :aria-expanded="openIndex === i"
        @click="toggle(i)"
      >
        <span
          class="font-serif text-xl text-primary transition-colors duration-300 sm:text-2xl"
          :class="openIndex === i ? 'text-accent' : ''"
          >{{ item.question }}</span
        >
        <span
          class="shrink-0 text-2xl text-accent transition-transform duration-300"
          :class="openIndex === i ? 'rotate-45' : ''"
          aria-hidden="true"
          >+</span
        >
      </button>
      <div
        class="grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <p class="text-body max-w-2xl px-4 pb-7">
            {{ item.answer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
