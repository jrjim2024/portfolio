<script setup lang="ts">
import PageBanner from '@/components/PageBanner.vue'
import BaseSection from '@/components/BaseSection.vue'
import AudienceList from '@/components/AudienceList.vue'
import PortfolioGallery from '@/components/PortfolioGallery.vue'
import Timeline from '@/components/Timeline.vue'
import PlanCards from '@/components/PlanCards.vue'
import InstagramBlock from '@/components/InstagramBlock.vue'
import ImageBreak from '@/components/ImageBreak.vue'
import CtaSection from '@/components/CtaSection.vue'

import { weddingBanner, weddingIntro, weddingAudience } from '@/content/pages'
import { weddingProcess, weddingPlans } from '@/content/services'
import {
  bridalPortfolio,
  ceremonyPortfolio,
  couplePortfolio,
  portraitPortfolio,
} from '@/content/portfolio'
import { weddingSections, imageBreaks } from '@/content/sections'
</script>

<template>
  <PageBanner :banner="weddingBanner" />

  <!-- 品牌理念 -->
  <BaseSection>
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div v-reveal class="reveal">
        <p class="eyebrow mb-4">{{ weddingIntro.eyebrow }}</p>
        <h2 class="heading-section">
          <template v-for="(line, i) in weddingIntro.title.split('\n')" :key="i">
            {{ line }}<br v-if="i < weddingIntro.title.split('\n').length - 1" />
          </template>
        </h2>
        <div class="mt-7 space-y-5 text-lg leading-relaxed text-muted">
          <p v-for="(p, i) in weddingIntro.paragraphs" :key="i" class="whitespace-pre-line">{{ p }}</p>
        </div>
      </div>
      <div v-reveal="0.12" class="reveal media">
        <img
          :src="weddingIntro.image"
          :alt="weddingIntro.title"
          class="media-img aspect-[4/5]"
          loading="lazy"
        />
      </div>
    </div>
  </BaseSection>

  <!-- 適合哪些客戶 -->
  <BaseSection
    tone="soft"
    :eyebrow="weddingAudience.eyebrow"
    :title="weddingAudience.title"
    :description="weddingAudience.description"
  >
    <AudienceList :items="weddingAudience.items" />
  </BaseSection>

  <!-- 婚紗作品 -->
  <BaseSection
    :eyebrow="weddingSections.bridal.eyebrow"
    :title="weddingSections.bridal.title"
    :description="weddingSections.bridal.description"
  >
    <PortfolioGallery :items="bridalPortfolio" />
  </BaseSection>

  <!-- 婚禮紀錄 -->
  <BaseSection
    tone="soft"
    :eyebrow="weddingSections.ceremony.eyebrow"
    :title="weddingSections.ceremony.title"
    :description="weddingSections.ceremony.description"
  >
    <PortfolioGallery :items="ceremonyPortfolio" />
  </BaseSection>

  <!-- 結婚登記 -->
  <BaseSection
    :eyebrow="weddingSections.portrait.eyebrow"
    :title="weddingSections.portrait.title"
    :description="weddingSections.portrait.description"
  >
    <PortfolioGallery :items="portraitPortfolio" />
  </BaseSection>

  <!-- 情侶寫真 -->
  <BaseSection
    tone="soft"
    :eyebrow="weddingSections.couple.eyebrow"
    :title="weddingSections.couple.title"
    :description="weddingSections.couple.description"
  >
    <PortfolioGallery :items="couplePortfolio" />
  </BaseSection>

  <!-- 圖片穿插 -->
  <ImageBreak
    :image="imageBreaks.wedding.image"
    :eyebrow="imageBreaks.wedding.eyebrow"
    :quote="imageBreaks.wedding.quote"
  />

  <!-- 拍攝流程 -->
  <BaseSection :eyebrow="weddingSections.process.eyebrow" :title="weddingSections.process.title">
    <Timeline :steps="weddingProcess" />
  </BaseSection>

  <!-- 方案介紹 -->
  <BaseSection
    tone="soft"
    :eyebrow="weddingSections.plans.eyebrow"
    :title="weddingSections.plans.title"
    :description="weddingSections.plans.description"
  >
    <PlanCards :plans="weddingPlans" />
  </BaseSection>

  <!-- Instagram -->
  <BaseSection tone="soft">
    <InstagramBlock />
  </BaseSection>

  <CtaSection primary-to="/contact?service=wedding" />
</template>
