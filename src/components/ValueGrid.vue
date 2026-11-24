<script setup lang="ts">
import type { BrandValue } from '@/content/types'

defineProps<{
  values: BrandValue[]
}>()
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-3">
    <div
      v-for="(value, i) in values"
      :key="value.title"
      v-reveal="i * 0.1"
      class="reveal card p-8 text-center sm:p-10 sm:text-left"
    >
      <span
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 text-accent sm:mx-0"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6"
          aria-hidden="true"
        >
          <template v-if="value.icon === 'interaction'">
            <path d="M7 8h10M7 12h6" />
            <path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4V5a1 1 0 0 1 1-1Z" />
          </template>
          <template v-else-if="value.icon === 'emotion'">
            <path
              d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5c2 0 3.2 1.2 3.9 2.3.7-1.1 1.9-2.3 3.9-2.3 3 0 4.5 3 3 6C19 15.65 12 20 12 20Z"
            />
          </template>
          <template v-else>
            <path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" />
          </template>
        </svg>
      </span>
      <h3 class="mt-5 font-serif text-2xl">{{ value.title }}</h3>
      <p class="mt-3 text-body">{{ value.description }}</p>
    </div>
  </div>
</template>
