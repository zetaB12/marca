import { useSyncExternalStore } from 'react'

/** Teléfono: pantalla estrecha, o apaisado (poca altura) con puntero táctil. */
const QUERY = '(max-width: 700px), (max-height: 520px) and (pointer: coarse)'

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** Móvil: las ventanas van a pantalla completa y se desactiva arrastrar/redimensionar. */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
