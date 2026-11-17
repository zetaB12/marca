import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react'
import { useBootProgress } from '../../hooks/useBootProgress'
import { HOURGLASS_CURSOR } from './hourglassSprite'
import styles from './Preloader.module.css'

const BLOCKS = 36

/** Líneas de arranque: aparecen en secuencia; la última se completa con "OK" al terminar la carga. */
const LINES = [
  'NEAL BIOS v1.0 — firmware original, ningún hardware real fue dañado',
  '> Iniciando NealOS...',
  '> Cargando servicios...',
  '> Cargando proyectos...',
] as const

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

  // Al terminar la carga se muestra "OK" un instante y se sale.
  useEffect(() => {
    if (!filled) return
    const t = window.setTimeout(() => {
      if (!leaving) {
        setLeaving(true)
        onReady()
      }
    }, 450)
    return () => window.clearTimeout(t)
  }, [filled, leaving, onReady])

  // Clic o cualquier tecla omiten la espera.
  useEffect(() => {
    if (leaving) return
    const skip = () => {
      setLeaving(true)
      onReady()
    }
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [leaving, onReady])

  // La barra solo avanza cuando ya es visible, para que la secuencia se vea completa.
  const shown = barVisible ? progress : 0

  if (gone) return null

  return (
    <div
      className={`${styles.root} ${leaving ? styles.leaving : ''}`}
      style={{ cursor: `url("${HOURGLASS_CURSOR}") 11 16, wait` } as CSSProperties}
      role="status"
      aria-label="Iniciando el sistema"
      onClick={leave}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) setGone(true)
      }}
    >
      <div className={styles.stack}>
        <h1 className={styles.title} aria-label="NealOS">
          NEAL<span>OS</span>
        </h1>

        <div className={styles.log}>
          {LINES.map((text, i) => (
            <p
              key={text}
              className={styles.line}
              style={{ animationDelay: `${0.25 + i * 0.35}s` }}
            >
              {text}
              {i === LINES.length - 1 && (
                <>
                  {filled && ' OK'} <span className={styles.cursor} aria-hidden />
                </>
              )}
            </p>
          ))}
        </div>

        <div
          className={styles.barWrap}
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
                if (e.propertyName === 'width' && progress >= 100 && barVisible) setFilled(true)
              }}
            />
          </div>
        </div>

        <div className={styles.foot}>
          <span className={styles.hint}>haz clic o presiona cualquier tecla para omitir</span>
          <button
            type="button"
            className={styles.skip}
            onClick={(e) => {
              e.stopPropagation()
              leave()
            }}
          >
            Omitir ⏎
          </button>
        </div>
      </div>
    </div>
  )
}
