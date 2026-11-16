import { useLayoutEffect, useState, type CSSProperties } from 'react'
import { useBootProgress } from '../../hooks/useBootProgress'
import Hourglass from './Hourglass'
import { HOURGLASS_CURSOR } from './hourglassSprite'
import styles from './Preloader.module.css'

const BLOCKS = 24

interface Props {
  /** Se llama cuando la carga termina y el preloader empieza a retirarse. */
  onReady: () => void
}

export default function Preloader({ onReady }: Props) {
  const progress = useBootProgress()
  const [barVisible, setBarVisible] = useState(false)
  const [filled, setFilled] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  // La capa estática #boot de index.html evita el parpadeo previo; React toma el relevo.
  useLayoutEffect(() => {
    document.getElementById('boot')?.remove()
  }, [])

  const leave = () => {
    if (leaving) return
    setLeaving(true)
    onReady()
  }

  // La barra solo avanza cuando ya es visible, para que la secuencia se vea completa.
  const shown = barVisible ? progress : 0

  if (gone) return null

  return (
    <div
      className={`${styles.root} ${leaving ? styles.leaving : ''}`}
      style={
        {
          cursor: `url("${HOURGLASS_CURSOR}") 11 16, wait`,
          '--boot-p': shown,
        } as CSSProperties
      }
      role="status"
      aria-label="Iniciando el sistema"
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) setGone(true)
      }}
    >
      <div className={styles.stack}>
        <div className={`${styles.step} ${styles.s2}`}>
          <Hourglass onCycle={() => filled && leave()} />
        </div>
        <p className={`${styles.text} ${styles.step} ${styles.s3}`}>Iniciando el sistema...</p>
        <div
          className={`${styles.barWrap} ${styles.step} ${styles.s4}`}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setBarVisible(true)
          }}
        >
          <div
            className={styles.bar}
            role="progressbar"
            aria-label="Cargando el sistema"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={shown}
          >
            <div
              className={styles.fill}
              style={{ width: `calc(${Math.round((shown / 100) * BLOCKS)} * var(--block))` }}
              onTransitionEnd={(e) => {
                if (e.propertyName !== 'width' || progress < 100 || !barVisible) return
                // Con movimiento reducido el reloj no gira: se sale al llegar al 100%.
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) leave()
                else setFilled(true)
              }}
            />
          </div>
          <span className={styles.pct} aria-hidden />
        </div>
      </div>
    </div>
  )
}
