import type { CSSProperties } from 'react'
import { useWallpaperPeriod } from '../../hooks/useWallpaperPeriod'
import { useSettingsStore } from '../../store/settingsStore'
import wallpaperSvg from './fondo.svg?raw'
import styles from './Wallpaper.module.css'

/** Sin ids duplicados (el fondo del escritorio ya los usa) y anclado arriba-derecha: se ve luna, nube y montañas. */
const SCENE_SVG = wallpaperSvg
  .replace(/\sid="[a-z]+"/g, '')
  .replace('preserveAspectRatio="xMidYMax slice"', 'preserveAspectRatio="xMaxYMax slice"')

/** Posición del sol en esta vista recortada (desplazamiento respecto a la luna), por período. */
const SUN: Record<string, [number, number]> = {
  morning: [-90, 330],
  afternoon: [-60, -30],
  sunset: [-120, 400],
  night: [0, 640],
}

/**
 * Mismo paisaje del fondo del escritorio, con la misma paleta según la hora (America/Lima).
 * Se coloca dentro de un contenedor `position: relative/absolute`; rellena todo su espacio.
 */
export default function WallpaperScene({ className }: { className?: string }) {
  const period = useWallpaperPeriod()
  const animations = useSettingsStore((s) => s.animations)
  const [x, y] = SUN[period]
  return (
    <div
      aria-hidden
      data-period={period}
      className={`${styles.svg} ${animations ? '' : styles.still} ${className ?? ''}`}
      style={{ '--sunx': `${x}px`, '--suny': `${y}px` } as CSSProperties}
      dangerouslySetInnerHTML={{ __html: SCENE_SVG }}
    />
  )
}
