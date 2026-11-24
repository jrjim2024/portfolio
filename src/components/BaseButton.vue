<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'outline' | 'ghost' | 'light'

const props = withDefaults(
  defineProps<{
    /** 站內路由 */
    to?: string
    /** 外部連結 */
    href?: string
    variant?: Variant
    block?: boolean
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    block: false,
    type: 'button',
    disabled: false,
  },
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'outline':
      return 'btn border border-primary/25 text-primary hover:bg-primary hover:text-background'
    case 'light':
      return 'btn border border-white/50 text-white hover:bg-white hover:text-primary'
    case 'ghost':
      // 文字型連結，不套 pill 樣式
      return 'group inline-flex items-center gap-2 text-base text-primary transition-colors duration-300 hover:text-accent'
    default:
      return 'btn bg-primary text-background hover:bg-accent'
  }
})

const classes = computed(() => [variantClass.value, props.block ? 'w-full' : ''])
const isGhost = computed(() => props.variant === 'ghost')
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
    <span
      v-if="isGhost"
      class="inline-block transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden="true"
      >→</span
    >
  </RouterLink>

  <a
    v-else-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="classes"
  >
    <slot />
    <span
      v-if="isGhost"
      class="inline-block transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden="true"
      >→</span
    >
  </a>

  <button
    v-else
    :type="type"
    :class="[classes, disabled ? 'pointer-events-none opacity-50' : '']"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
