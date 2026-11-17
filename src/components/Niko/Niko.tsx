import { useEffect, useState, type CSSProperties } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useSettingsStore } from '../../store/settingsStore'
import idle from '../../assets/niko/idle.webp'
import walkLeft from '../../assets/niko/walk-left.webp'
import walkRight from '../../assets/niko/walk-right.webp'
import styles from './Niko.module.css'

type Mode = 'idle' | 'left' | 'right'

const IDLE_BEFORE_WALK_MS = 4000
const IDLE_AT_TURN_MS = 3500
// El ciclo de caminar dura 0,8 s y recorre 12 px del sprite por medio ciclo: 30 px/s a 64 px.
// Esa velocidad (por la escala) evita que los pies "patinen" sobre el suelo.
const SPEED_PX_S_AT_64 = 30

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Niko.exe, el asistente: reposa en la esquina inferior derecha y pasea de vez en cuando. */
export default function Niko() {
  const mobile = useIsMobile()
  const animations = useSettingsStore((s) => s.animations)
  const [mode, setMode] = useState<Mode>('idle')
  const [x, setX] = useState(0)
  const [duration, setDuration] = useState(0)

  // Ampliación entera del sprite de 64 px (nítido): ×1 móvil, ×2 laptop, ×3 monitores grandes.
  const scale = mobile ? 1 : window.innerWidth >= 1800 ? 3 : 2
  const distance = 90 * scale
  const reduced =
    !animations || window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    const walkMs = Math.round((distance / (SPEED_PX_S_AT_64 * scale)) * 1000)

    const patrol = async () => {
      while (!cancelled) {
        await wait(IDLE_BEFORE_WALK_MS)
        if (cancelled) return
        setDuration(walkMs); setMode('left'); setX(-distance)
        await wait(walkMs)
        if (cancelled) return
        setMode('idle')
        await wait(IDLE_AT_TURN_MS)
        if (cancelled) return
        setDuration(walkMs); setMode('right'); setX(0)
        await wait(walkMs)
        if (cancelled) return
        setMode('idle')
      }
    }
    void patrol()
    return () => {
      cancelled = true
    }
  }, [reduced, distance, scale])

  const walking = !reduced && mode !== 'idle'
  const image = mode === 'left' ? walkLeft : mode === 'right' ? walkRight : idle

  return (
    <div className={styles.niko} style={{ '--s': `${64 * scale}px` } as CSSProperties} aria-hidden>
      <div
        className={styles.mover}
        style={{ transform: `translateX(${reduced ? 0 : x}px)`, transitionDuration: `${duration}ms` }}
      >
        <div
          className={`${styles.sprite} ${walking ? styles.walk : ''}`}
          style={{ backgroundImage: `url(${walking ? image : idle})` }}
        />
      </div>
    </div>
  )
}
