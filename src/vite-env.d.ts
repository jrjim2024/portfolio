/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string
  readonly VITE_SITE_URL: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_FACEBOOK_URL: string
  readonly VITE_LINE_URL: string
  readonly VITE_GOOGLE_MAP_URL: string
  readonly VITE_GA_ID: string
  readonly VITE_GOOGLE_SITE_VERIFICATION: string
  readonly VITE_GOOGLE_FORM_ACTION: string
  readonly VITE_GOOGLE_FORM_ENTRY_NAME: string
  readonly VITE_GOOGLE_FORM_ENTRY_PHONE: string
  readonly VITE_GOOGLE_FORM_ENTRY_EMAIL: string
  readonly VITE_GOOGLE_FORM_ENTRY_TYPE: string
  readonly VITE_GOOGLE_FORM_ENTRY_DATE: string
  readonly VITE_GOOGLE_FORM_ENTRY_MESSAGE: string
  /** AI Commerce public channel key (pub_*) — not a secret */
  readonly VITE_ACA_TENANT_KEY: string
  readonly VITE_ACA_API_BASE: string
  readonly VITE_ACA_WIDGET_SRC: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module '*?url' {
  const src: string
  export default src
}
