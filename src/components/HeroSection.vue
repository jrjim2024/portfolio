<script setup lang="ts">
import { hero } from '@/content/hero'
import BaseButton from './BaseButton.vue'

const titleLines = hero.title.split('\n')
</script>

<template>
  <section class="relative h-screen min-h-[600px] overflow-hidden bg-primary [height:100svh]">
    <!-- 後方：滿版模糊背景 -->
    <img
      :src="hero.image"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl"
    />
    <div class="absolute inset-0 bg-primary/40" />

    <!-- 前方：約 80% 高、置中的清晰主圖 -->
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <img
        :src="hero.image"
        :alt="hero.subtitle"
        class="h-[80%] w-auto max-w-[94%] rounded-2xl object-cover shadow-[0_30px_90px_rgba(0,0,0,0.5)] [animation:fade-up_1.2s_var(--ease-soft)_forwards]"
      />
    </div>

    <!-- 文字可讀性 overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-primary/30" />

    <div class="container-page relative flex h-full flex-col justify-end pb-24 pt-32">
      <p
        class="mb-6 text-xs uppercase tracking-[0.28em] text-accent-soft opacity-0 [animation:fade-up_0.8s_0.2s_var(--ease-soft)_forwards]"
      >
        {{ hero.eyebrow }}
      </p>
      <h1
        class="heading-hero max-w-[700px] !text-white opacity-0 [animation:fade-up_0.9s_0.35s_var(--ease-soft)_forwards]"
      >
        <template v-for="(line, i) in titleLines" :key="i">
          {{ line }}<br v-if="i < titleLines.length - 1" />
        </template>
      </h1>
      <p
        class="mt-7 max-w-[600px] text-lg leading-relaxed text-white/90 opacity-0 [animation:fade-up_0.9s_0.55s_var(--ease-soft)_forwards] sm:text-xl"
      >
        {{ hero.description }}
      </p>
      <div
        class="mt-10 flex flex-wrap gap-4 opacity-0 [animation:fade-up_0.9s_0.7s_var(--ease-soft)_forwards]"
      >
        <BaseButton :to="hero.primaryCta.to" :href="hero.primaryCta.href" variant="primary">{{
          hero.primaryCta.label
        }}</BaseButton>
        <BaseButton :to="hero.secondaryCta.to" :href="hero.secondaryCta.href" variant="light">{{
          hero.secondaryCta.label
        }}</BaseButton>
      </div>
    </div>

    <!-- Scroll Down Indicator -->
    <div
      class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 sm:flex"
    >
      <span class="text-[0.65rem] uppercase tracking-[0.2em]">Scroll</span>
      <span class="relative h-10 w-px overflow-hidden bg-white/20">
        <span class="absolute inset-x-0 top-0 h-1/2 bg-white/70 [animation:scroll-dot_1.8s_var(--ease-soft)_infinite]" />
      </span>
    </div>
  </section>
</template>
