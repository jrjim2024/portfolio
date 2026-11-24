<script setup lang="ts">
import type { ServiceItem } from '@/content/types'

defineProps<{
  items: ServiceItem[]
}>()
</script>

<template>
  <div class="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
    <article
      v-for="(item, i) in items"
      :key="item.key"
      v-reveal="(i % 3) * 0.08"
      class="reveal group"
    >
      <div class="media bg-line">
        <img
          :src="item.image"
          :alt="item.name"
          loading="lazy"
          class="media-img aspect-[4/5] group-hover:scale-[1.03]"
        />
      </div>
      <h3 class="mt-5 font-serif text-2xl">{{ item.name }}</h3>
      <p class="mt-2 text-body">{{ item.description }}</p>
    </article>
  </div>
</template>
