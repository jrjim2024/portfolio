<script setup lang="ts">
withDefaults(
  defineProps<{
    image: string
    quote?: string
    eyebrow?: string
    /** 高度：normal 約 56vh / tall 約 72vh */
    height?: 'normal' | 'tall'
    inset?: boolean
  }>(),
  {
    height: 'normal',
  },
)
</script>

<template>
  <section
    :class="inset ? 'bg-background px-5 py-12 sm:px-10 sm:py-16 lg:py-24' : ''"
  >
    <div
      class="relative flex items-center justify-center overflow-hidden bg-primary"
      :class="inset
        ? 'mx-auto aspect-[4/3] w-full max-w-[960px] rounded-[var(--radius-card)] sm:aspect-[16/9]'
        : height === 'tall' ? 'h-[72vh] min-h-[480px]' : 'h-[56vh] min-h-[400px]'"
    >
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${image})` }"
      />
      <div class="absolute inset-0 bg-primary/55" />
      <div v-if="quote || eyebrow" v-reveal class="reveal relative w-full px-5 text-center">
        <p v-if="eyebrow" class="eyebrow mb-5 !text-accent-soft">{{ eyebrow }}</p>
        <p
          v-if="quote"
          class="mx-auto max-w-5xl whitespace-pre-line font-serif text-[clamp(.75rem,4vw,2.75rem)] leading-[1.4] text-white"
        >
          {{ quote }}
        </p>
      </div>
    </div>
  </section>
</template>
