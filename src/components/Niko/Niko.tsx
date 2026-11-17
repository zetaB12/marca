import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useSettingsStore } from '../../store/settingsStore'
import idle from '../../assets/niko/idle.webp'
import sleep from '../../assets/niko/sleep.webp'
import think from '../../assets/niko/think.webp'
import walkLeft from '../../assets/niko/walk-left.webp'
import walkRight from '../../assets/niko/walk-right.webp'
import styles from './Niko.module.css'

type Mode = 'idle' | 'left' | 'right'
/**
 * Poses: `open`, `blink` y `happy` son fotogramas de la hoja de reposo; `think` y `sleep` tienen
 * hoja propia de 4 fotogramas (burbuja de pensamiento y letras zZz).
 */
type Pose = 'open' | 'blink' | 'happy' | 'think' | 'sleep'
const IDLE_FRAME = {
  open: styles.f0,
  blink: styles.f1,
  happy: styles.f2,
}

const THINK_MS = 4200 // al llegar al final del paseo se detiene a pensar
const HAPPY_MS = 1400 // y sonríe al "tener la idea"
const BLINK_MS = 140
const SLEEP_AFTER_MS = 30000 // sin actividad del visitante durante 30 s, se duerme
const WAKE_MS = 1100 // al despertar sonríe un momento
// Cualquiera de estas acciones cuenta como actividad: reinicia la cuenta atrás y despierta a Niko.
const ACTIVITY = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
// El ciclo de caminar dura 0,8 s y recorre 12 px del sprite por medio ciclo: 30 px/s a 64 px.
// Esa velocidad (por la escala) evita que los pies "patinen" sobre el suelo.
const SPEED_PX_S_AT_64 = 30

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Niko.exe, el asistente: se queda quieto en la esquina inferior derecha y parpadea.
 * - Al hacerle clic da un paseo: camina, se para a pensar, sonríe y vuelve a su sitio.
 * - Si el visitante no hace nada durante 30 s, se duerme (ojos cerrados y letras zZz).
 *   Cualquier clic, toque, tecla o desplazamiento en la web lo despierta.
 */
export default function Niko() {
  const mobile = useIsMobile()
  const animations = useSettingsStore((s) => s.animations)
  const [mode, setMode] = useState<Mode>('idle')
  const [pose, setPose] = useState<Pose>('open')
  const [busy, setBusy] = useState(false) // true durante el paseo
  const [x, setX] = useState(0)
  const [duration, setDuration] = useState(0)
  const alive = useRef(true)
  const wakingUntil = useRef(0) // el clic que despierta a Niko no debe iniciar un paseo

  // Ampliación entera del sprite de 64 px (nítido): ×1 móvil, ×2 laptop, ×3 monitores grandes.
  const scale = mobile ? 1 : window.innerWidth >= 1800 ? 3 : 2
  const distance = 90 * scale
  const walkMs = Math.round((distance / (SPEED_PX_S_AT_64 * scale)) * 1000)
  const reduced =
    !animations || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const asleep = pose === 'sleep'

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  // Parpadeo a intervalos irregulares (entre 1,8 y 4 s) mientras está despierto y en reposo.
  useEffect(() => {
    if (reduced || busy || asleep) return
    let cancelled = false
    const blink = async () => {
      while (!cancelled) {
        await wait(1800 + Math.random() * 2200)
        if (cancelled) return
        setPose('blink')
        await wait(BLINK_MS)
        if (cancelled) return
        setPose('open')
      }
    }
    void blink()
    return () => {
      cancelled = true
    }
  }, [reduced, busy, asleep])

  // Cuenta atrás para dormirse: cada acción del visitante la reinicia.
  useEffect(() => {
    if (reduced || busy || asleep) return
    let timer = 0
    const arm = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setPose('sleep'), SLEEP_AFTER_MS)
    }
    arm()
    ACTIVITY.forEach((e) => window.addEventListener(e, arm, { passive: true }))
    return () => {
      window.clearTimeout(timer)
      ACTIVITY.forEach((e) => window.removeEventListener(e, arm))
    }
  }, [reduced, busy, asleep])

  // Dormido: la primera acción del visitante lo despierta.
  useEffect(() => {
    if (!asleep) return
    const wake = () => {
      wakingUntil.current = Date.now() + WAKE_MS + 400
      setPose('happy')
      window.setTimeout(() => alive.current && setPose((p) => (p === 'happy' ? 'open' : p)), WAKE_MS)
    }
    ACTIVITY.forEach((e) => window.addEventListener(e, wake, { once: true, passive: true }))
    return () => ACTIVITY.forEach((e) => window.removeEventListener(e, wake))
  }, [asleep])

  // Un solo paseo por clic; los clics durante el paseo o al despertar se ignoran.
  const stroll = async () => {
    if (reduced || busy || asleep || Date.now() < wakingUntil.current) return
    const ok = () => alive.current
    setBusy(true)
    setPose('open')
    setDuration(walkMs); setMode('left'); setX(-distance)
    await wait(walkMs)
    if (!ok()) return
    setMode('idle')
    setPose('think')
    await wait(THINK_MS)
    if (!ok()) return
    setPose('happy')
    await wait(HAPPY_MS)
    if (!ok()) return
    setPose('open')
    setDuration(walkMs); setMode('right'); setX(0)
    await wait(walkMs)
    if (!ok()) return
    setMode('idle')
    setBusy(false)
  }

  const walking = !reduced && mode !== 'idle'
  const thinking = !reduced && !walking && pose === 'think'
  const sleeping = !reduced && !walking && asleep
  const image = walking ? (mode === 'left' ? walkLeft : walkRight) : thinking ? think : sleeping ? sleep : idle
  const resting = reduced || pose === 'think' || pose === 'sleep' ? 'open' : pose
  const frames = walking
    ? styles.walk
    : thinking
      ? styles.think
      : sleeping
        ? styles.sleep
        : `${styles.idleSheet} ${IDLE_FRAME[resting]}`

  return (
    <div className={styles.niko} style={{ '--s': `${64 * scale}px` } as CSSProperties}>
      <div
        className={styles.mover}
        style={{ transform: `translateX(${reduced ? 0 : x}px)`, transitionDuration: `${duration}ms` }}
      >
        <button
          type="button"
          className={`${styles.sprite} ${styles.hit} ${busy || reduced || asleep ? styles.still : ''} ${frames}`}
          style={{ backgroundImage: `url(${image})` }}
          onClick={() => void stroll()}
          aria-label="Niko, el asistente. Haz clic para que dé un paseo"
        />
      </div>
    </div>
  )
}
