/**
 * Commerce AI Chat Widget — existing-website integration.
 * Loads pub_* public channel key only; never merchantId / secrets.
 *
 * Env (see .env.example):
 *   VITE_ACA_TENANT_KEY  — pub_* from photography Web channel
 *   VITE_ACA_API_BASE    — Commerce API (e.g. http://localhost:3000)
 *   VITE_ACA_WIDGET_SRC  — chat-widget.js URL (e.g. http://localhost:5174/chat-widget.js)
 */
import type { Router } from 'vue-router'

type MountFn = (
  host: HTMLElement,
  options: {
    tenantKey: string
    apiBase: string
    getPageContext?: () => Record<string, unknown> | null
    layoutMode?: 'embed' | 'hosted'
  },
) => { unmount: () => void }

declare global {
  interface Window {
    AiCommerceChatWidget?: { mount: MountFn }
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    )
    if (existing && window.AiCommerceChatWidget?.mount) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`[aca-widget] failed to load ${src}`))
    document.body.appendChild(s)
  })
}

export async function initCommerceWidget(router: Router): Promise<void> {
  const tenantKey = String(import.meta.env.VITE_ACA_TENANT_KEY ?? '').trim()
  const apiBase = String(
    import.meta.env.VITE_ACA_API_BASE ?? 'http://localhost:3000',
  ).replace(/\/$/, '')
  const widgetSrc = String(import.meta.env.VITE_ACA_WIDGET_SRC ?? '').trim()

  if (!tenantKey || !widgetSrc) {
    if (import.meta.env.DEV) {
      console.info(
        '[aca-widget] skipped — set VITE_ACA_TENANT_KEY and VITE_ACA_WIDGET_SRC to enable',
      )
    }
    return
  }

  let semanticLabel = ''
  router.afterEach((to) => {
    semanticLabel = String(
      (to.meta.navTitle as string | undefined) ||
        (to.meta.title as string | undefined) ||
        '',
    ).slice(0, 120)
    const meta = document.querySelector('meta[name="aca-page-label"]')
    if (meta) {
      meta.setAttribute('content', semanticLabel)
    } else if (semanticLabel) {
      const el = document.createElement('meta')
      el.setAttribute('name', 'aca-page-label')
      el.setAttribute('content', semanticLabel)
      document.head.appendChild(el)
    }
  })

  try {
    await loadScript(widgetSrc)
  } catch (err) {
    console.warn(err)
    return
  }

  const mount = window.AiCommerceChatWidget?.mount
  if (!mount) {
    console.warn('[aca-widget] AiCommerceChatWidget.mount unavailable')
    return
  }

  let host = document.getElementById('aca-chat-widget-host')
  if (!host) {
    host = document.createElement('div')
    host.id = 'aca-chat-widget-host'
    document.body.appendChild(host)
  }

  mount(host, {
    tenantKey,
    apiBase,
    getPageContext: () => {
      const path = location.pathname.slice(0, 500)
      const slug =
        !path || path === '/'
          ? 'home'
          : (path.replace(/\/+$/, '').split('/').filter(Boolean).pop() ??
              'home'
            ).slice(0, 120)
      return {
        pageUrl: location.href.slice(0, 2000),
        pagePath: path,
        pageSlug: slug,
        pageTitle: document.title.slice(0, 200),
        pageType: 'external',
        ...(semanticLabel ? { semanticLabel } : {}),
      }
    },
  })
}
