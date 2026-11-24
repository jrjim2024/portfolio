<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import SocialIcon from './SocialIcon.vue'
import { socialPortfolioUrl } from '@/content/brand'
import { instagramBlock, ui } from '@/content/sections'
</script>

<template>
  <div>
    <div v-reveal class="reveal mb-12 text-center">
      <span class="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-accent">
        <SocialIcon name="instagram" />
      </span>
      <p class="eyebrow mb-3">{{ instagramBlock.eyebrow }}</p>
      <h2 class="heading-section">{{ instagramBlock.title }}</h2>
      <p class="text-lead mx-auto mt-4 max-w-md">{{ instagramBlock.description }}</p>
    </div>

    <!-- 6 張 IG 風格圖片 -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
      <a
        v-for="(image, i) in instagramBlock.images"
        :key="i"
        :href="socialPortfolioUrl"
        target="_blank"
        rel="noopener noreferrer"
        v-reveal="(i % 3) * 0.08"
        class="reveal media group relative aspect-square"
      >
        <img
          :src="image"
          :alt="`Instagram ${i + 1}`"
          loading="lazy"
          class="media-img group-hover:scale-[1.03]"
        />
        <span
          class="absolute inset-0 flex items-center justify-center bg-primary/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <SocialIcon name="instagram" />
        </span>
      </a>
    </div>

    <div class="mt-10 text-center">
      <BaseButton :href="socialPortfolioUrl" variant="primary">{{ ui.followInstagram }}</BaseButton>
    </div>
  </div>
</template>
