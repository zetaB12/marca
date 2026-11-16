import { useEffect, useState } from 'react'

const FONTS = ['16px W95FA', '700 20px "Space Grotesk"', '400 16px Inter']
const TASKS = FONTS.length + 2 // + evento load + primer pintado
const FAILSAFE_MS = 8000 // solo evita quedar bloqueado si algo nunca resuelve (red caída, pestaña oculta)

/**
 * Progreso real de arranque (0-100): fuentes cargadas, evento `load` de la página
 * y primer pintado de la aplicación. No simula nada: cada tarea suma al terminar.
 */
export function useBootProgress() {
  const [done, setDone] = useState(0)

  useEffect(() => {
    let cancelled = false
    const finish = () => !cancelled && setDone((n) => Math.min(n + 1, TASKS))

    FONTS.forEach((spec) => {
      const loading = document.fonts?.load(spec) ?? Promise.resolve()
      loading.catch(() => undefined).finally(finish)
    })

    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((res) => window.addEventListener('load', () => res(), { once: true }))
    loaded.then(finish)

    new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res()))).then(
      finish,
    )

    const failsafe = window.setTimeout(() => !cancelled && setDone(TASKS), FAILSAFE_MS)
    return () => {
      cancelled = true
      window.clearTimeout(failsafe)
    }
  }, [])

  return Math.round((done / TASKS) * 100)
}
