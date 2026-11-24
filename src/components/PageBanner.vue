<script setup lang="ts">
import type { PageBanner } from '@/content/pages'

defineProps<{
  banner: PageBanner
}>()
</script>

<template>
  <section class="relative flex h-screen min-h-[600px] items-end overflow-hidden bg-primary [height:100svh]">
    <!-- 後方：滿版模糊背景 -->
    <img
      :src="banner.image"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl"
    />
    <div class="absolute inset-0 bg-primary/40" />

    <!-- 前方：約 80% 高、置中的清晰主圖 -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <img
        :src="banner.image"
        :alt="banner.title"
        class="h-[80%] w-auto max-w-[94%] rounded-2xl object-cover shadow-[0_30px_90px_rgba(0,0,0,0.5)] [animation:fade-up_1.2s_var(--ease-soft)_forwards]"
      />
    </div>

    <!-- 文字可讀性 overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-primary/30" />

    <div class="container-page relative pb-16 pt-28">
      <p
        class="mb-5 text-xs uppercase tracking-[0.28em] text-accent-soft opacity-0 [animation:banner-up_1s_0.15s_var(--ease-soft)_forwards]"
      >
        {{ banner.eyebrow }}
      </p>
      <h1
        class="heading-serif !text-white text-5xl leading-[1.05] opacity-0 [animation:banner-up_1.1s_0.3s_var(--ease-soft)_forwards] sm:text-6xl lg:text-7xl"
      >
        <template v-for="(line, i) in banner.title.split('\n')" :key="i">
          {{ line }}<br v-if="i < banner.title.split('\n').length - 1" />
        </template>
      </h1>
      <p
        class="mt-6 max-w-xl text-lg leading-relaxed text-white/90 opacity-0 [animation:banner-up_1.1s_0.5s_var(--ease-soft)_forwards]"
      >
        <template v-for="(line, i) in banner.description.split('\n')" :key="i">
          {{ line }}<br v-if="i < banner.description.split('\n').length - 1" />
        </template>
      </p>
    </div>
  </section>
</template>
