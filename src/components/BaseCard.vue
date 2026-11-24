<script setup lang="ts">
withDefaults(
  defineProps<{
    image?: string
    label?: string
    title?: string
    description?: string
    to?: string
    href?: string
    /** 圖片長寬比 */
    ratio?: 'portrait' | 'landscape' | 'square'
  }>(),
  {
    ratio: 'portrait',
  },
)

const ratioClass: Record<string, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
}
</script>

<template>
  <component
    :is="to ? 'RouterLink' : href ? 'a' : 'div'"
    :to="to"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="group block"
  >
    <div class="media relative bg-line">
      <img
        v-if="image"
        :src="image"
        :alt="title ?? ''"
        loading="lazy"
        :class="[ratioClass[ratio], 'media-img group-hover:scale-[1.03]']"
      />
      <slot name="overlay" />
    </div>

    <div v-if="label || title || description" class="pt-5">
      <p v-if="label" class="eyebrow mb-2">{{ label }}</p>
      <h3 v-if="title" class="font-serif text-2xl text-primary">{{ title }}</h3>
      <p v-if="description" class="mt-2 text-body">
        {{ description }}
      </p>
      <slot />
    </div>
  </component>
</template>
