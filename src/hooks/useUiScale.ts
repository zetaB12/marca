import { useSyncExternalStore } from 'react'
import { uiScale } from '../utils/uiScale'

const subscribe = (cb: () => void) => {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}

/** Factor de escala de la interfaz (1 en laptop, hasta 1,6 en monitores grandes). */
export function useUiScale() {
  return useSyncExternalStore(subscribe, () => uiScale(window.innerWidth), () => 1)
}
