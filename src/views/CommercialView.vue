<script setup lang="ts">
import PageBanner from '@/components/PageBanner.vue'
import BaseSection from '@/components/BaseSection.vue'
import AudienceList from '@/components/AudienceList.vue'
import ServiceList from '@/components/ServiceList.vue'
import PortfolioGallery from '@/components/PortfolioGallery.vue'
import Timeline from '@/components/Timeline.vue'
import InstagramBlock from '@/components/InstagramBlock.vue'
import ImageBreak from '@/components/ImageBreak.vue'
import CtaSection from '@/components/CtaSection.vue'
import BaseButton from '@/components/BaseButton.vue'

import { commercialBanner, commercialIntro, commercialAudience } from '@/content/pages'
import { commercialServices, commercialProcess } from '@/content/services'
import { commercialPortfolio } from '@/content/portfolio'
import { commercialSections, imageBreaks, ui } from '@/content/sections'
import { brand } from '@/content/brand'
</script>

<template>
  <PageBanner :banner="commercialBanner" />

  <!-- 品牌理念 -->
  <BaseSection>
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div v-reveal class="reveal">
        <p class="eyebrow mb-4">{{ commercialIntro.eyebrow }}</p>
        <h2 class="heading-section">
          <template v-for="(line, i) in commercialIntro.title.split('\n')" :key="i">
            {{ line }}<br v-if="i < commercialIntro.title.split('\n').length - 1" />
          </template>
        </h2>
        <div class="mt-7 space-y-5 text-lg leading-relaxed text-muted">
          <p v-for="(p, i) in commercialIntro.paragraphs" :key="i" class="whitespace-pre-line">{{ p }}</p>
        </div>
      </div>
      <div v-reveal="0.12" class="reveal media">
        <img
          :src="commercialIntro.image"
          :alt="commercialIntro.title"
          class="media-img aspect-[4/5]"
          loading="lazy"
        />
      </div>
    </div>
  </BaseSection>

  <!-- 適合哪些品牌 -->
  <BaseSection
    tone="soft"
    :eyebrow="commercialAudience.eyebrow"
    :title="commercialAudience.title"
    :description="commercialAudience.description"
  >
    <AudienceList :items="commercialAudience.items" />
  </BaseSection>

  <!-- 服務內容 -->
  <BaseSection
    :eyebrow="commercialSections.services.eyebrow"
    :title="commercialSections.services.title"
    :description="commercialSections.services.description"
  >
    <ServiceList :items="commercialServices" />
  </BaseSection>

  <!-- 案例展示 -->
  <BaseSection
    tone="soft"
    :eyebrow="commercialSections.cases.eyebrow"
    :title="commercialSections.cases.title"
    :description="commercialSections.cases.description"
  >
    <PortfolioGallery :items="commercialPortfolio" masonry />
  </BaseSection>

  <!-- 圖片穿插 -->
  <ImageBreak
    inset
    :image="imageBreaks.commercial.image"
    :eyebrow="imageBreaks.commercial.eyebrow"
    :quote="imageBreaks.commercial.quote"
  />

  <!-- 合作流程 -->
  <BaseSection :eyebrow="commercialSections.process.eyebrow" :title="commercialSections.process.title">
    <Timeline :steps="commercialProcess" />
  </BaseSection>

  <!-- 專案諮詢（無制式方案） -->
  <BaseSection
    tone="soft"
    :eyebrow="commercialSections.consult.eyebrow"
    :title="commercialSections.consult.title"
    :description="commercialSections.consult.description"
  >
    <div v-reveal class="reveal flex flex-wrap gap-4">
      <BaseButton to="/contact?service=commercial" variant="primary">立即預約</BaseButton>
      <BaseButton :href="brand.lineUrl" variant="outline">{{ ui.lineConsult }}</BaseButton>
    </div>
  </BaseSection>

  <!-- Instagram -->
  <BaseSection>
    <InstagramBlock />
  </BaseSection>

  <CtaSection primary-to="/contact?service=commercial" />
</template>
