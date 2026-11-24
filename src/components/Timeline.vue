<script setup lang="ts">
import type { ProcessStep } from '@/content/types'

defineProps<{
  steps: ProcessStep[]
}>()
</script>

<template>
  <ol class="grid gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
    <li
      v-for="(s, i) in steps"
      :key="s.step"
      v-reveal="i * 0.1"
      class="reveal relative flex items-start gap-5 lg:flex-col lg:items-stretch"
    >
      <!-- 節點 + 連接線 -->
      <div class="relative flex shrink-0 items-center lg:w-full">
        <span
          class="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-background text-accent"
        >
          <!-- 圖示 -->
          <svg
            v-if="s.icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-7 w-7"
            aria-hidden="true"
          >
            <template v-if="s.icon === 'chat'">
              <path d="M7.5 19.5A9 9 0 1 0 4.5 16.5L3 21Z" />
              <path d="M8.5 11h7M8.5 14h4" />
            </template>
            <template v-else-if="s.icon === 'plan'">
              <rect x="5" y="4" width="14" height="17" rx="2" />
              <path d="M9.5 4V3.2A.8.8 0 0 1 10.3 2.4h3.4a.8.8 0 0 1 .8.8V4Z" />
              <path d="M8.5 10h7M8.5 14h5" />
            </template>
            <template v-else-if="s.icon === 'camera'">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
              <circle cx="12" cy="13" r="3.4" />
            </template>
            <template v-else>
              <path d="M21.8 10.5A10 10 0 1 1 13 2.3" />
              <path d="m8.5 11.5 3 3 9-9.5" />
            </template>
          </svg>
          <!-- 編號角標 -->
          <span
            class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[0.7rem] font-medium text-background"
          >
            {{ s.step }}
          </span>
        </span>
        <!-- 桌機：橫向連接線 -->
        <span
          v-if="i < steps.length - 1"
          class="absolute left-[4.5rem] right-0 top-1/2 hidden h-px -translate-y-1/2 bg-line lg:block"
        />
      </div>

      <!-- 手機：直向連接線 -->
      <span
        v-if="i < steps.length - 1"
        class="absolute bottom-0 left-8 top-16 w-px bg-line lg:hidden"
      />

      <div class="pb-2 lg:pb-0 lg:pt-6">
        <h3 class="font-serif text-xl">{{ s.title }}</h3>
        <p class="mt-2 text-body">{{ s.description }}</p>
      </div>
    </li>
  </ol>
</template>
