<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageBanner from '@/components/PageBanner.vue'
import BaseSection from '@/components/BaseSection.vue'
import BaseButton from '@/components/BaseButton.vue'
import SocialIcon from '@/components/SocialIcon.vue'
import Timeline from '@/components/Timeline.vue'

import { contactBanner, inquiryTypes, contactPage, contactProcess } from '@/content/pages'
import { brand, socials, contactVisibility } from '@/content/brand'
import { submitGoogleForm } from '@/utils/submitGoogleForm'
import { weddingPlans } from '@/content/services'
import { isGoogleFormConfigured } from '@/content/googleForm'

const route = useRoute()
const initialType = computed(() => route.query.service === 'commercial' ? '商業／產品攝影' : inquiryTypes[0])
const selectedPlan = computed(() =>
  route.query.service === 'wedding' ? weddingPlans.find(plan => plan.name === route.query.plan) : undefined,
)
const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei' }).format(new Date())
const demoForm = !isGoogleFormConfigured()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  type: initialType.value,
  date: '',
  message: '',
})

const submitted = ref(false)
const isDemoSubmission = ref(false)
const submitting = ref(false)
const submitError = ref('')
watch(initialType, type => { form.type = type })

/** 送出至 Google 表單（寫入回應／可連結試算表）。 */
async function handleSubmit() {
  if (submitting.value) return

  submitted.value = false
  submitError.value = ''
  const phone = form.phone.trim()
  const digits = phone.replace(/\D/g, '')
  if (!form.name.trim() || !/^[+\d()\s-]+$/.test(phone) || digits.length < 8 || digits.length > 15) {
    submitError.value = '請填寫姓名及有效的聯絡電話。'
    return
  }
  if (form.date && form.date < today) {
    submitError.value = '期望拍攝日期請選今天或之後。'
    return
  }
  submitting.value = true

  try {
    const result = await submitGoogleForm({
      name: form.name.trim(),
      phone,
      email: form.email.trim(),
      type: form.type,
      date: form.date || '未指定',
      message: [selectedPlan.value && `感興趣的方案：${selectedPlan.value.name}`, form.message.trim()].filter(Boolean).join('\n'),
    })
    isDemoSubmission.value = result === 'demo'
    submitted.value = true
    form.name = ''
    form.email = ''
    form.phone = ''
    form.type = initialType.value
    form.date = ''
    form.message = ''
  } catch {
    submitError.value = contactPage.form.error
  } finally {
    submitting.value = false
  }
}

const inputClass =
  'w-full border-b border-line bg-transparent py-3 text-ink placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none'
</script>

<template>
  <PageBanner :banner="contactBanner" />

  <BaseSection>
    <div
      class="grid gap-16 lg:gap-24"
      :class="contactVisibility.info ? 'lg:grid-cols-[0.85fr_1.15fr]' : 'mx-auto lg:max-w-2xl lg:grid-cols-1'"
    >
      <!-- 聯絡資訊：電話／LINE（信箱與工作室已隱藏） -->
      <div v-if="contactVisibility.info" v-reveal class="reveal">
        <p class="eyebrow mb-4">{{ contactPage.info.eyebrow }}</p>
        <h2 class="heading-section">{{ contactPage.info.title }}</h2>
        <p class="mt-6 max-w-md leading-relaxed text-muted">
          {{ contactPage.info.description }}
        </p>

        <dl class="mt-10 space-y-6 text-sm">
          <div v-if="contactVisibility.email">
            <dt class="eyebrow mb-1">{{ contactPage.info.labels.email }}</dt>
            <dd>
              <a :href="`mailto:${brand.email}`" class="text-lg text-primary hover:text-accent">{{
                brand.email
              }}</a>
            </dd>
          </div>
          <div>
            <dt class="eyebrow mb-1">{{ contactPage.info.labels.phone }}</dt>
            <dd class="text-lg text-primary">
              <a :href="`tel:${brand.phone.replace(/-/g, '')}`" class="hover:text-accent">{{
                brand.phone
              }}</a>
            </dd>
          </div>
          <div>
            <dt class="eyebrow mb-1">{{ contactPage.info.labels.line }}</dt>
            <dd class="text-lg text-primary">
              <a
                :href="brand.lineUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-accent"
                >{{ brand.line }}</a
              >
            </dd>
          </div>
          <div v-if="contactVisibility.studio">
            <dt class="eyebrow mb-1">{{ contactPage.info.labels.studio }}</dt>
            <dd class="text-lg text-primary">{{ brand.address }}</dd>
            <dd class="mt-1 text-muted">{{ brand.hours }}</dd>
          </div>
        </dl>

        <div class="mt-10 flex gap-3">
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="s.label"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink/70 transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <SocialIcon :name="s.icon" />
          </a>
        </div>
      </div>

      <!-- 預約表單（靜態） -->
      <div v-reveal="0.1" class="reveal">
        <form class="space-y-7" @submit.prevent="handleSubmit">
          <p v-if="selectedPlan" class="rounded-xl border border-line px-4 py-3 text-sm">
            諮詢方案 · {{ selectedPlan.name }}
          </p>
          <p v-if="demoForm" class="text-sm text-muted">本機展示表單，可使用測試資料。</p>
          <div class="grid gap-7 sm:grid-cols-2">
            <div>
              <label class="eyebrow mb-2 block" for="name">{{ contactPage.form.name.label }}</label>
              <input
                id="name"
                v-model="form.name"
                autocomplete="name"
                required
                :class="inputClass"
                :placeholder="contactPage.form.name.placeholder"
              />
            </div>
            <div>
              <label class="eyebrow mb-2 block" for="phone">{{ contactPage.form.phone.label }}</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                autocomplete="tel"
                required
                :class="inputClass"
                :placeholder="contactPage.form.phone.placeholder"
              />
            </div>
          </div>

          <div>
            <label class="eyebrow mb-2 block" for="email">{{ contactPage.form.email.label }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              :class="inputClass"
              :placeholder="contactPage.form.email.placeholder"
            />
          </div>

          <div class="grid gap-7 sm:grid-cols-2">
            <div>
              <label class="eyebrow mb-2 block" for="type">{{ contactPage.form.type.label }}</label>
              <select id="type" v-model="form.type" :class="inputClass">
                <option v-for="t in inquiryTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div>
              <label class="eyebrow mb-2 block" for="date">{{ contactPage.form.date.label }}</label>
              <input id="date" v-model="form.date" type="date" :min="today" :class="inputClass" />
            </div>
          </div>

          <div>
            <label class="eyebrow mb-2 block" for="message">{{ contactPage.form.message.label }}</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="4"
              :class="inputClass"
              :placeholder="contactPage.form.message.placeholder"
            />
          </div>

          <div class="pt-2">
            <BaseButton type="submit" :disabled="submitting">
              {{ submitting ? contactPage.form.submitting : contactPage.form.submit }}
            </BaseButton>
          </div>

          <p v-if="submitted && isDemoSubmission" class="text-sm text-accent" role="status">
            展示表單測試完成，資料未傳送。
          </p>
          <p v-else-if="submitted" class="text-sm text-accent" role="status">
            已送出詢問。若需確認是否收到，請透過 LINE 聯繫工作室。
          </p>
          <p v-else-if="submitError" class="text-sm text-red-700/80" role="alert">
            {{ submitError }}
          </p>
        </form>
      </div>
    </div>

    <!-- 服務地區 / 回覆時間 / 預約方式 -->
    <div class="mt-16 grid gap-6 sm:grid-cols-3">
      <div
        v-for="(item, i) in [
          contactPage.highlights.serviceArea,
          contactPage.highlights.responseTime,
          contactPage.highlights.booking,
        ]"
        :key="item.label"
        v-reveal="i * 0.1"
        class="reveal card p-8"
      >
        <p class="mb-3 text-xs uppercase tracking-[0.18em] text-accent">{{ item.label }}</p>
        <p class="text-lg leading-relaxed text-primary sm:text-xl">{{ item.value }}</p>
      </div>
    </div>
  </BaseSection>

  <!-- 合作流程（Timeline） -->
  <BaseSection
    tone="soft"
    :eyebrow="contactProcess.heading.eyebrow"
    :title="contactProcess.heading.title"
  >
    <Timeline :steps="contactProcess.steps" />
  </BaseSection>

  <!-- Google Map / 工作室地址（雇主暫時隱藏） -->
  <section v-if="contactVisibility.studio" class="border-t border-line">
    <div
      class="flex h-[360px] items-center justify-center bg-soft text-center"
      :aria-label="contactPage.map.ariaLabel"
    >
      <div>
        <p class="eyebrow mb-3">{{ contactPage.map.eyebrow }}</p>
        <p class="font-serif text-2xl text-primary">{{ brand.address }}</p>
        <p class="mt-2 text-sm text-muted">{{ contactPage.map.note }}</p>
      </div>
    </div>
  </section>
</template>
