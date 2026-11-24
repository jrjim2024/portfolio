<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { brand } from '@/content/brand'
import { navbarItems } from '@/content/navigation'
import { logoDark, logoWhite } from '@/content/photos'

const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

/** 首頁有全幅 Hero，導覽列初始為透明覆蓋；其他頁面一律使用實心底。 */
const isHome = computed(() => route.name === 'home')
const solid = computed(() => scrolled.value || !isHome.value || mobileOpen.value)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

watch(mobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
    :class="
      mobileOpen
        ? 'bg-background shadow-[0_8px_30px_rgba(17,17,17,0.06)]'
        : solid
          ? 'bg-background/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(17,17,17,0.06)]'
          : 'bg-transparent'
    "
  >
    <nav class="container-page flex h-20 items-center justify-between">
      <RouterLink to="/" class="flex items-center" :aria-label="brand.name">
        <img
          :src="solid ? logoDark : logoWhite"
          :alt="brand.name"
          class="w-auto transition-all duration-300"
          :class="solid ? 'h-12 sm:h-14' : 'h-14 sm:h-16 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]'"
        />
      </RouterLink>

      <ul class="hidden items-center gap-1 lg:flex">
        <li v-for="item in navbarItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="group relative rounded-full px-3.5 py-2 text-base tracking-wide transition-colors duration-300"
            :class="[
              solid ? 'text-ink/80 hover:text-primary hover:bg-soft' : 'text-white/80 hover:text-white hover:bg-white/10',
              route.path === item.path ? (solid ? 'text-primary' : 'text-white') : '',
            ]"
          >
            {{ item.navTitle }}
            <span
              class="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-accent transition-all duration-300 group-hover:w-5"
              :class="route.path === item.path ? '!w-5' : ''"
            />
          </RouterLink>
        </li>
      </ul>

      <button
        type="button"
        class="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        :aria-label="mobileOpen ? '關閉選單' : '開啟選單'"
        @click="mobileOpen = !mobileOpen"
      >
        <span
          class="h-px w-6 transition-all duration-300"
          :class="[solid ? 'bg-primary' : 'bg-white', mobileOpen ? 'translate-y-[7px] rotate-45' : '']"
        />
        <span
          class="h-px w-6 transition-all duration-300"
          :class="[solid ? 'bg-primary' : 'bg-white', mobileOpen ? 'opacity-0' : '']"
        />
        <span
          class="h-px w-6 transition-all duration-300"
          :class="[solid ? 'bg-primary' : 'bg-white', mobileOpen ? '-translate-y-[7px] -rotate-45' : '']"
        />
      </button>
    </nav>

  </header>

  <!-- Mobile menu：Teleport 到 body，避免 header 的 backdrop-blur 影響 fixed 定位 -->
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-background lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="主選單"
      >
        <ul class="container-page flex flex-col py-6">
          <li v-for="(item, i) in navbarItems" :key="item.path" v-reveal="i * 0.04" class="reveal">
            <RouterLink
              :to="item.path"
              class="block border-b border-line py-4 font-serif text-3xl text-primary transition-colors hover:text-accent"
              :class="route.path === item.path ? 'text-accent' : ''"
            >
              {{ item.navTitle }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </transition>
  </Teleport>
</template>
