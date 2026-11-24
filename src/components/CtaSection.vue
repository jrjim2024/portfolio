<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'
import { defaultCta } from '@/content/sections'
import { brand } from '@/content/brand'

const CONTACT_PATH = '/contact'

const props = defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryHref?: string
}>()

const eyebrowText = computed(() => props.eyebrow ?? defaultCta.eyebrow)
const titleText = computed(() => props.title ?? defaultCta.title ?? '')
const descriptionText = computed(() => props.description ?? defaultCta.description)
const primaryLabelText = computed(() => props.primaryLabel ?? defaultCta.primaryLabel)
const primaryToPath = computed(() => props.primaryTo ?? CONTACT_PATH)
const secondaryLabelText = computed(() => props.secondaryLabel ?? defaultCta.secondaryLabel)
const secondaryHrefValue = computed(() => props.secondaryHref ?? brand.lineUrl)
const titleLines = computed(() => titleText.value.split('\n'))
</script>

<template>
  <section class="bg-primary text-background">
    <div class="container-page section-y">
      <div v-reveal class="reveal mx-auto max-w-3xl text-center">
        <p class="eyebrow mb-5">{{ eyebrowText }}</p>
        <h2 class="heading-section !text-background">
          <template v-for="(line, i) in titleLines" :key="i">
            {{ line }}<br v-if="i < titleLines.length - 1" />
          </template>
        </h2>
        <p v-if="descriptionText" class="mx-auto mt-6 max-w-xl text-background/70">
          {{ descriptionText }}
        </p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <BaseButton :to="primaryToPath" variant="light">{{ primaryLabelText }}</BaseButton>
          <BaseButton
            v-if="secondaryLabelText && secondaryHrefValue"
            :href="secondaryHrefValue"
            variant="ghost"
            class="text-background hover:!text-accent"
            >{{ secondaryLabelText }}</BaseButton
          >
        </div>
      </div>
    </div>
  </section>
</template>
