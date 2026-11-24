<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<template>
  <ul class="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
    <li
      v-for="(item, i) in items"
      :key="item"
      v-reveal="(i % 3) * 0.06"
      class="reveal flex items-start gap-3 border-b border-line py-4"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mt-0.5 h-6 w-6 shrink-0 text-accent"
        aria-hidden="true"
      >
        <path d="m5 12 4.5 4.5L19 7" />
      </svg>
      <span class="text-base leading-relaxed text-ink sm:text-[1.0625rem]">{{ item }}</span>
    </li>
  </ul>
</template>
