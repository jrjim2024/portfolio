<script setup lang="ts">
import type { Review } from '@/content/types'

defineProps<{
  reviews: Review[]
}>()
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-2">
    <figure
      v-for="(r, i) in reviews"
      :key="r.id"
      v-reveal="(i % 2) * 0.08"
      class="reveal flex flex-col rounded-[var(--radius-card)] border border-line bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div v-if="r.rating" class="mb-5 flex gap-1 text-accent" aria-hidden="true">
        <span v-for="n in r.rating" :key="n">★</span>
      </div>
      <blockquote class="flex-1 font-serif text-xl leading-relaxed text-primary">
        “{{ r.quote }}”
      </blockquote>
      <figcaption class="mt-6 text-base">
        <span class="font-medium text-primary">{{ r.author }}</span>
        <span class="text-muted"> ・ {{ r.role }}</span>
      </figcaption>
    </figure>
  </div>
</template>
