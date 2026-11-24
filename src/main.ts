import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal'
import { initAnalytics } from './plugins/analytics'
import { initCommerceWidget } from './plugins/commerce-widget'
import './style.css'
import { loadLocalContent, previewMode } from './content/localCms'

const app = createApp(App)

// Pinia 於 V1 僅作預留：尚未建立任何 store，待未來串接資料來源時使用。
app.use(createPinia())
app.use(router)
app.directive('reveal', vReveal)

async function start() {
  await loadLocalContent()
  app.mount('#app')
  if (!import.meta.env.DEV && !previewMode && location.pathname !== '/admin') {
    initAnalytics()
    void initCommerceWidget(router)
  }
}
void start()
