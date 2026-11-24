<script setup lang="ts">
import type { Plan } from '@/content/types'
import BaseButton from './BaseButton.vue'

defineProps<{
  plans: Plan[]
}>()
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-3">
    <div
      v-for="(plan, i) in plans"
      :key="plan.name"
      v-reveal="i * 0.08"
      class="reveal flex flex-col rounded-[var(--radius-card)] p-8 transition-all duration-300"
      :class="
        plan.featured
          ? 'bg-primary text-background shadow-[var(--shadow-card-hover)]'
          : 'border border-line bg-background hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]'
      "
    >
      <p
        class="text-xs uppercase tracking-[0.18em]"
        :class="plan.featured ? 'text-accent-soft' : 'text-accent'"
      >
        {{ plan.featured ? 'Most Popular' : 'Plan' }}
      </p>
      <h3 class="mt-3 font-serif text-3xl" :class="plan.featured ? '!text-background' : ''">
        {{ plan.name }}
      </h3>
      <p class="mt-2 text-body" :class="plan.featured ? '!text-background/75' : ''">
        {{ plan.description }}
      </p>

      <div class="mt-6 flex items-end gap-1">
        <span class="font-serif text-4xl" :class="plan.featured ? '!text-background' : 'text-primary'">{{
          plan.price
        }}</span>
        <span
          v-if="plan.unit"
          class="pb-1 text-base"
          :class="plan.featured ? 'text-background/60' : 'text-muted'"
          >{{ plan.unit }}</span
        >
      </div>

      <ul class="mt-7 space-y-3 text-base">
        <li
          v-for="(f, fi) in plan.features"
          :key="fi"
          class="flex items-start gap-3"
          :class="[
            plan.featured ? 'text-background/80' : 'text-ink/80',
            f === '' ? 'h-2' : '',
          ]"
        >
          <template v-if="f !== ''">
            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {{ f }}
          </template>
        </li>
      </ul>

      <div class="mt-auto pt-8">
        <BaseButton
          :to="'/contact?service=wedding&plan=' + encodeURIComponent(plan.name)"
          :variant="plan.featured ? 'light' : 'outline'"
          block
          >預約諮詢</BaseButton
        >
      </div>
    </div>
  </div>
</template>
