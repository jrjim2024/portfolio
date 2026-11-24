<script setup lang="ts">
import { ref, computed } from 'vue'
import PageBanner from '@/components/PageBanner.vue'
import BaseSection from '@/components/BaseSection.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import CtaSection from '@/components/CtaSection.vue'

import { faqBanner } from '@/content/pages'
import { faqCategories } from '@/content/faq'

const active = ref(0)
const activeItems = computed(() => faqCategories[active.value]?.items ?? [])
</script>

<template>
  <PageBanner :banner="faqBanner" />

  <BaseSection>
    <!-- 分類 Tab -->
    <div v-reveal class="reveal mb-12 flex flex-wrap gap-3" role="group" aria-label="問題分類">
      <button
        v-for="(block, i) in faqCategories"
        :key="block.category"
        type="button"
        :aria-pressed="active === i"
        class="rounded-full border px-5 py-2.5 text-sm transition-all duration-300"
        :class="
          active === i
            ? 'border-primary bg-primary text-background'
            : 'border-line text-ink/70 hover:border-accent hover:text-accent'
        "
        @click="active = i"
      >
        {{ block.category }}
      </button>
    </div>

    <!-- 內容（切換分類時淡入） -->
    <transition
      mode="out-in"
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <FaqAccordion :key="active" :items="activeItems" />
    </transition>
  </BaseSection>

  <CtaSection />
</template>
