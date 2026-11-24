<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import ScrollProgress from '@/components/ScrollProgress.vue'
import BackToTop from '@/components/BackToTop.vue'
import { useRoute } from 'vue-router'
import { previewMode } from '@/content/localCms'
const route = useRoute()
</script>

<template>
  <ScrollProgress />
  <AppNavbar v-if="route.name !== 'admin'" />
  <div v-if="previewMode" class="fixed bottom-4 left-4 z-50 rounded-full bg-primary px-5 py-2 text-white">
    草稿預覽 · <a href="/admin">返回後台</a>
  </div>
  <main>
    <RouterView v-slot="{ Component, route }">
      <transition
        mode="out-in"
        enter-active-class="transition-opacity duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div :key="route.path">
          <component :is="Component" />
        </div>
      </transition>
    </RouterView>
  </main>
  <AppFooter v-if="route.name !== 'admin'" />
  <BackToTop />
</template>
