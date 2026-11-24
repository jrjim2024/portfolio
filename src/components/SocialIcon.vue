<script setup lang="ts">
import type { SocialLink } from '@/content/types'

defineProps<{
  name: SocialLink['icon']
}>()
</script>

<template>
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
    <template v-if="name === 'instagram'">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </template>
    <template v-else-if="name === 'facebook'">
      <path d="M14 8.5h2.5M14 8.5V7a2 2 0 0 1 2-2h1M14 8.5v12M14 8.5h-2.5M14 12.5h2.5" />
    </template>
    <template v-else-if="name === 'line'">
      <rect x="3" y="4" width="18" height="14" rx="5" />
      <path d="m8 21 1.5-3" />
      <path d="M8 10v4M8 10h2.2M8 12h2M8 14h2.2M12.5 10v4M16 10v4l-2.5-4v4" />
    </template>
    <template v-else>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </template>
  </svg>
</template>
