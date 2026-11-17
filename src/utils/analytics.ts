/**
 * Google Analytics 4, preparado pero apagado por defecto.
 *
 * - Solo se activa si existe VITE_GA_MEASUREMENT_ID (formato G-XXXXXXXXXX). Sin él no se carga nada.
 * - Por privacidad no mide hasta que haya consentimiento: llama a `grantAnalyticsConsent()` cuando el
 *   visitante acepte (p. ej. desde un banner de cookies). Si prefieres medir sin consentimiento previo,
 *   pon VITE_GA_REQUIRE_CONSENT=false en .env.
 * - Respeta "No rastrear" (Do Not Track) del navegador.
 * - Se inicializa una sola vez, aunque se llame varias veces. La web tiene una sola ruta, así que
 *   el page_view automático inicial es suficiente (no hay navegación entre páginas que medir).
 */
const ID = ((import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? '').trim()
const REQUIRE_CONSENT = (import.meta.env.VITE_GA_REQUIRE_CONSENT as string | undefined) !== 'false'
const CONSENT_KEY = 'neal-analytics-consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let started = false

const validId = /^G-[A-Z0-9]{6,}$/.test(ID)
const doNotTrack = () => navigator.doNotTrack === '1' || (window as { doNotTrack?: string }).doNotTrack === '1'

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted'
  } catch {
    return false
  }
}

function start() {
  if (started || !validId || doNotTrack()) return
  started = true
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // gtag.js exige recibir el objeto `arguments`, no un array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', ID, { anonymize_ip: true })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID)}`
  document.head.appendChild(script)
}

/** Llamar una vez al arrancar la app. No hace nada si no hay ID o si falta el consentimiento. */
export function initAnalytics() {
  if (!validId) return
  if (!REQUIRE_CONSENT || readConsent()) start()
}

/** Llamar cuando el visitante acepte las estadísticas. Guarda la decisión y activa la medición. */
export function grantAnalyticsConsent() {
  try {
    localStorage.setItem(CONSENT_KEY, 'granted')
  } catch {
    /* sin almacenamiento: se mide solo esta visita */
  }
  start()
}
