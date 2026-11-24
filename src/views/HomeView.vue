<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import BaseSection from '@/components/BaseSection.vue'
import BaseButton from '@/components/BaseButton.vue'
import PortfolioGallery from '@/components/PortfolioGallery.vue'
import Timeline from '@/components/Timeline.vue'
import ReviewGrid from '@/components/ReviewGrid.vue'
import ValueGrid from '@/components/ValueGrid.vue'
import ImageBreak from '@/components/ImageBreak.vue'
import CtaSection from '@/components/CtaSection.vue'

import { dualEntries, brandPhilosophy, brandValues, brandValuesHeading } from '@/content/hero'
import { features, weddingProcess } from '@/content/services'
import { featuredPortfolio } from '@/content/portfolio'
import { reviews } from '@/content/reviews'
import { socialPortfolioUrl } from '@/content/brand'
import { findNavRoute } from '@/content/navigation'
import { homeSections, ui, imageBreaks } from '@/content/sections'

const aboutRoute = findNavRoute('about')
</script>

<template>
  <HeroSection />

  <!-- 雙入口 -->
  <BaseSection>
    <div class="grid gap-6 md:grid-cols-2">
      <RouterLink
        v-for="(entry, i) in dualEntries"
        :key="entry.key"
        v-reveal="i * 0.1"
        :to="entry.to"
        class="reveal media group relative block aspect-[4/5] bg-primary sm:aspect-[3/4]"
      >
        <img
          :src="entry.image"
          :alt="entry.title"
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
        <div class="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
          <p class="text-xs uppercase tracking-[0.22em] text-accent-soft">{{ entry.label }}</p>
          <h3 class="mt-3 font-serif text-4xl text-white sm:text-5xl">{{ entry.title }}</h3>
          <p class="mt-3 max-w-sm text-base leading-relaxed text-white/85">
            {{ entry.description }}
          </p>
          <span
            class="mt-6 inline-flex items-center gap-2 text-sm text-white transition-transform duration-300 group-hover:translate-x-1"
          >
            {{ ui.exploreMore }}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </RouterLink>
    </div>
  </BaseSection>

  <!-- 品牌理念 -->
  <BaseSection tone="soft">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div v-reveal class="reveal order-2 lg:order-1">
        <p class="eyebrow mb-4">{{ brandPhilosophy.eyebrow }}</p>
        <h2 class="heading-section">
          <template v-for="(line, i) in brandPhilosophy.title.split('\n')" :key="i">
            {{ line }}<br v-if="i < brandPhilosophy.title.split('\n').length - 1" />
          </template>
        </h2>
        <div class="mt-7 max-w-xl space-y-5 text-lg leading-relaxed text-muted">
          <p v-for="(p, i) in brandPhilosophy.paragraphs" :key="i" class="whitespace-pre-line">{{ p }}</p>
        </div>
        <div v-if="aboutRoute" class="mt-9">
          <BaseButton :to="aboutRoute.path" variant="outline">{{ aboutRoute.navTitle }}</BaseButton>
        </div>
      </div>
      <div v-reveal="0.12" class="reveal media order-1 lg:order-2">
        <img
          :src="brandPhilosophy.image"
          :alt="brandPhilosophy.eyebrow"
          class="media-img aspect-[4/5]"
          loading="lazy"
        />
      </div>
    </div>
  </BaseSection>

  <!-- 服務特色 -->
  <BaseSection
    :eyebrow="homeSections.features.eyebrow"
    :title="homeSections.features.title"
    :description="homeSections.features.description"
  >
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="(f, i) in features"
        :key="f.title"
        v-reveal="i * 0.08"
        class="reveal media group relative aspect-[3/4] bg-primary"
      >
        <img
          v-if="f.image"
          :src="f.image"
          :alt="f.title"
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-primary/5" />
        <div class="absolute inset-0 flex flex-col justify-end p-6">
          <span class="font-serif text-3xl text-white/55">{{ f.index }}</span>
          <h3 class="mt-2 font-serif text-2xl text-white">{{ f.title }}</h3>
          <p class="mt-2 text-base leading-relaxed text-white/85">{{ f.description }}</p>
        </div>
      </article>
    </div>
  </BaseSection>

  <!-- 精選作品（限 6 組） -->
  <BaseSection
    tone="soft"
    :eyebrow="homeSections.portfolio.eyebrow"
    :title="homeSections.portfolio.title"
    :description="homeSections.portfolio.description"
  >
    <PortfolioGallery :items="featuredPortfolio" />
    <div class="mt-14 text-center">
      <BaseButton :href="socialPortfolioUrl" variant="outline">{{ ui.instagramMore }}</BaseButton>
    </div>
  </BaseSection>

  <!-- 品牌價值 -->
  <BaseSection
    :eyebrow="brandValuesHeading.eyebrow"
    :title="brandValuesHeading.title"
    :description="brandValuesHeading.description"
  >
    <ValueGrid :values="brandValues" />
  </BaseSection>

  <!-- 圖片穿插 -->
  <ImageBreak
    :image="imageBreaks.home.image"
    :eyebrow="imageBreaks.home.eyebrow"
    :quote="imageBreaks.home.quote"
  />

  <!-- 拍攝流程 -->
  <BaseSection
    tone="soft"
    :eyebrow="homeSections.process.eyebrow"
    :title="homeSections.process.title"
    :description="homeSections.process.description"
  >
    <Timeline :steps="weddingProcess" />
  </BaseSection>

  <!-- 客戶評價 -->
  <BaseSection
    :eyebrow="homeSections.reviews.eyebrow"
    :title="homeSections.reviews.title"
    :description="homeSections.reviews.description"
  >
    <ReviewGrid :reviews="reviews" />
  </BaseSection>

  <CtaSection />
</template>
