import { uiScale } from './uiScale'

/**
 * W95FA es una fuente pixel vectorial: cada "píxel" de la fuente mide 0.08 × font-size.
 * Se ve nítida cuando eso ocupa un número entero de píxeles del dispositivo, es decir
 * font-size = 12.5 × n / devicePixelRatio.
 *
 * El tamaño objetivo crece con el ancho de la pantalla (un monitor de 24" necesita letras más
 * grandes que un laptop). Si hay un tamaño nítido cerca del objetivo se usa ese; si no, se usa
 * el objetivo tal cual (algo menos nítido, pero legible).
 */
const PIXEL_EM = 12.5
const TOLERANCE = 0.15

function snap(target: number, dpr: number) {
  let best = target
  let bestErr = Infinity
  for (let n = 1; n <= 12; n++) {
    const size = (PIXEL_EM * n) / dpr
    const err = Math.abs(size - target) / target
    if (err < bestErr) {
      best = size
      bestErr = err
    }
  }
  return bestErr <= TOLERANCE ? best : target
}

function apply() {
  const dpr = window.devicePixelRatio || 1
  const scale = uiScale(window.innerWidth)
  const root = document.documentElement.style
  const px = (v: number) => `${Math.round(v * 100) / 100}px`
  root.setProperty('--text-scale', String(Math.round(scale * 100) / 100))
  // Interfaz grande (taskbar, menús, botones): 18 px en laptop, hasta ~29 px en monitores grandes.
  root.setProperty('--fs-ui', px(snap(18 * scale, dpr)))
  // Interfaz pequeña (títulos de ventana, etiquetas, estados): 12,5 px en laptop.
  root.setProperty('--fs-ui-sm', px(snap(12.5 * scale, dpr)))
}

export function initFontScale() {
  apply()
  // Cambia al redimensionar la ventana o al cambiar de monitor/zoom (varía el DPR).
  let frame = 0
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(apply)
  })
  const watch = () => {
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    mq.addEventListener(
      'change',
      () => {
        apply()
        watch()
      },
      { once: true },
    )
  }
  watch()
}
