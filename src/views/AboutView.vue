<script setup lang="ts">
import PageBanner from '@/components/PageBanner.vue'
import BaseSection from '@/components/BaseSection.vue'
import Timeline from '@/components/Timeline.vue'
import ImageBreak from '@/components/ImageBreak.vue'
import CtaSection from '@/components/CtaSection.vue'
import { about } from '@/content/about'
import { imageBreaks } from '@/content/sections'
import { aboutPhotos } from '@/content/photos'

const philosophyImage = aboutPhotos[17]
const serviceImage = aboutPhotos[0]
</script>

<template>
  <PageBanner
    :banner="{
      eyebrow: about.banner.eyebrow,
      title: about.banner.title,
      description: about.banner.description,
      image: about.banner.image,
    }"
  />

  <!-- 品牌理念 -->
  <BaseSection :eyebrow="about.philosophy.eyebrow" :title="about.philosophy.title">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div v-reveal class="reveal space-y-5 text-lg leading-relaxed text-muted">
        <p v-for="(p, i) in about.philosophy.paragraphs" :key="i" class="whitespace-pre-line">{{ p }}</p>
      </div>
      <div v-reveal="0.12" class="reveal media">
        <img
          :src="philosophyImage"
          :alt="about.philosophy.title"
          class="media-img aspect-[4/5]"
          loading="lazy"
        />
      </div>
    </div>
  </BaseSection>

  <!-- 我們相信 -->
  <BaseSection tone="soft" :eyebrow="about.believe.eyebrow" :title="about.believe.title">
    <div class="grid gap-x-10 gap-y-12 sm:grid-cols-3">
      <div
        v-for="(item, i) in about.believe.items"
        :key="item.title"
        v-reveal="i * 0.08"
        class="reveal border-t border-line pt-6"
      >
        <h3 class="font-serif text-2xl">{{ item.title }}</h3>
        <p class="mt-3 text-body">{{ item.description }}</p>
      </div>
    </div>
  </BaseSection>

  <!-- 圖片穿插 -->
  <ImageBreak
    :image="imageBreaks.about.image"
    :eyebrow="imageBreaks.about.eyebrow"
    :quote="imageBreaks.about.quote"
  />

  <!-- 攝影風格 -->
  <BaseSection :eyebrow="about.style.eyebrow" :title="about.style.title">
    <div class="grid gap-x-10 gap-y-12 sm:grid-cols-3">
      <div
        v-for="(item, i) in about.style.items"
        :key="item.title"
        v-reveal="i * 0.08"
        class="reveal border-t border-line pt-6"
      >
        <h3 class="font-serif text-2xl">{{ item.title }}</h3>
        <p class="mt-3 text-body">{{ item.description }}</p>
      </div>
    </div>
  </BaseSection>

  <!-- 服務理念 -->
  <BaseSection tone="soft" :eyebrow="about.serviceBelief.eyebrow" :title="about.serviceBelief.title">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div v-reveal class="reveal media order-2 lg:order-1">
        <img
          :src="serviceImage"
          :alt="about.serviceBelief.title"
          class="media-img aspect-[4/3]"
          loading="lazy"
        />
      </div>
      <div v-reveal="0.12" class="reveal order-1 space-y-5 text-lg leading-relaxed text-muted lg:order-2">
        <p v-for="(p, i) in about.serviceBelief.paragraphs" :key="i">{{ p }}</p>
      </div>
    </div>
  </BaseSection>

  <!-- 合作方式 -->
  <BaseSection :eyebrow="about.collaboration.eyebrow" :title="about.collaboration.title">
    <Timeline :steps="about.collaboration.steps" />
  </BaseSection>

  <!-- 攝影師介紹 -->
  <BaseSection tone="soft">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div v-reveal class="reveal media">
        <img
          :src="about.photographer.image"
          :alt="about.photographer.name"
          class="media-img aspect-[4/5]"
          loading="lazy"
        />
      </div>
      <div v-reveal="0.1" class="reveal">
        <p class="eyebrow mb-4">{{ about.photographer.eyebrow }}</p>
        <h2 class="heading-section">{{ about.photographer.name }}</h2>
        <p class="mt-2 text-sm uppercase tracking-[0.18em] text-accent">
          {{ about.photographer.title }}
        </p>
        <div class="mt-7 space-y-5 text-lg leading-relaxed text-muted">
          <p v-for="(p, i) in about.photographer.bio" :key="i">{{ p }}</p>
        </div>

        <div class="mt-10 space-y-8 border-t border-line pt-8">
          <div v-for="block in about.photographer.resume" :key="block.title">
            <h3 class="font-serif text-xl text-primary">{{ block.title }}</h3>
            <ul class="mt-3 space-y-2 text-body">
              <li v-for="(item, i) in block.items" :key="i" class="leading-relaxed">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>

  <!-- 工作花絮（預留） -->
  <BaseSection
    :eyebrow="about.behindScenes.eyebrow"
    :title="about.behindScenes.title"
    :description="about.behindScenes.description"
  >
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
      <div
        v-for="(image, i) in about.behindScenes.images"
        :key="i"
        v-reveal="i * 0.08"
        class="reveal media bg-line"
      >
        <img
          :src="image"
          :alt="`${about.behindScenes.title} ${i + 1}`"
          class="media-img aspect-square"
          loading="lazy"
        />
      </div>
    </div>
  </BaseSection>

  <CtaSection />
</template>
