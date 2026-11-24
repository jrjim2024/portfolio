<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    /** 標題以 \n 換行 */
    description?: string
    /** 標題置中 */
    centered?: boolean
    /** 區塊背景：default(背景色) / primary(深色) / soft(米色加深) */
    tone?: 'default' | 'primary' | 'soft'
    id?: string
  }>(),
  {
    centered: false,
    tone: 'default',
  },
)
</script>

<template>
  <section
    :id="id"
    class="section-y"
    :class="[
      tone === 'primary' ? 'bg-primary text-background' : '',
      tone === 'soft' ? 'bg-soft' : '',
    ]"
  >
    <div class="container-page">
      <!-- Section Header：統一格式 Subtitle → Title → Description -->
      <header
        v-if="eyebrow || title || description"
        v-reveal
        class="reveal max-w-2xl"
        :class="centered ? 'mx-auto text-center' : ''"
      >
        <p v-if="eyebrow" class="eyebrow mb-4">{{ eyebrow }}</p>
        <h2
          v-if="title"
          class="heading-section"
          :class="tone === 'primary' ? '!text-background' : ''"
        >
          <template v-for="(line, i) in title.split('\n')" :key="i">
            {{ line }}<br v-if="i < title.split('\n').length - 1" />
          </template>
        </h2>
        <p
          v-if="description"
          class="text-lead mt-6"
          :class="tone === 'primary' ? '!text-background/70' : ''"
        >
          {{ description }}
        </p>
      </header>

      <div :class="(eyebrow || title || description) ? 'mt-14 sm:mt-20' : ''">
        <slot />
      </div>
    </div>
  </section>
</template>
