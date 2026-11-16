import { useEffect } from 'react'
import { useDesktopStore } from '../store/desktopStore'
import { useSettingsStore } from '../store/settingsStore'

/** Refleja la preferencia de animaciones en <html data-motion>. Espera a que acabe el preloader. */
export function useApplySettings() {
  const animations = useSettingsStore((s) => s.animations)
  const booted = useDesktopStore((s) => s.booted)

  useEffect(() => {
    if (booted) document.documentElement.dataset.motion = animations ? 'on' : 'off'
  }, [animations, booted])
}
