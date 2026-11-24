<script setup lang="ts">
import { brand, siteCredit, socials } from '@/content/brand'
import { findNavRoute } from '@/content/navigation'
import { logoWhite } from '@/content/photos'
import SocialIcon from './SocialIcon.vue'

const year = new Date().getFullYear()

const navLinks = ['home', 'about', 'faq', 'contact']
  .map(findNavRoute)
  .filter((r): r is NonNullable<typeof r> => !!r)

const serviceLinks = ['wedding', 'commercial']
  .map(findNavRoute)
  .filter((r): r is NonNullable<typeof r> => !!r)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="bg-primary text-background/80">
    <div class="container-page pb-20 pt-14 lg:pb-24 lg:pt-16">
      <div class="grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-20">
        <!-- Brand：Logo 較靠近上緣 -->
        <div class="max-w-xl">
          <img :src="logoWhite" :alt="`${brand.name}｜德米攝影 Demi Photo Studio`" class="h-12 w-auto sm:h-14" />
          <p class="mt-3 text-base tracking-wide text-background/75">{{ brand.legalName }}</p>
          <p class="mt-1 text-sm text-background/55">德米攝影 Demi Photo Studio</p>
          <div class="mt-6 space-y-3.5 text-base leading-[1.75] text-background/70 sm:text-[1.0625rem]">
            <p v-for="(p, i) in brand.philosophy" :key="i">{{ p }}</p>
          </div>
        </div>

        <!-- Navigation / Services / Social：整體下移 -->
        <div class="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-16 lg:gap-12 xl:mt-20">
          <div>
            <p class="eyebrow mb-5 !text-accent-soft">Navigation</p>
            <ul class="space-y-4 text-lg">
              <li v-for="item in navLinks" :key="item.path">
                <RouterLink :to="item.path" class="transition-colors hover:text-accent">
                  {{ item.navTitle }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <p class="eyebrow mb-5 !text-accent-soft">Services</p>
            <ul class="space-y-4 text-lg">
              <li v-for="item in serviceLinks" :key="item.path">
                <RouterLink :to="item.path" class="transition-colors hover:text-accent">
                  {{ item.navTitle }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <div>
            <p class="eyebrow mb-5 !text-accent-soft">Social</p>
            <ul class="space-y-4 text-lg">
              <li v-for="s in socials" :key="s.label">
                <a
                  :href="s.href"
                  :target="s.icon === 'mail' ? undefined : '_blank'"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-3 text-background/80 transition-colors hover:text-accent"
                >
                  <SocialIcon :name="s.icon" />
                  {{ s.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-background/10">
      <div
        class="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-background/50 sm:flex-row"
      >
        <p class="text-center sm:text-left">
          © {{ year }} {{ brand.copyright }}. All rights reserved.
          <span class="mx-1.5 text-background/25" aria-hidden="true">·</span>
          <a
            :href="siteCredit.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-background/45 transition-colors hover:text-accent"
          >
            {{ siteCredit.prefix }} {{ siteCredit.label }}
          </a>
        </p>
        <button
          type="button"
          class="group inline-flex items-center gap-2 text-background/60 transition-colors hover:text-accent"
          @click="scrollToTop"
        >
          Back to Top
          <span class="transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true">↑</span>
        </button>
      </div>
    </div>
  </footer>
</template>
