import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { SpeakerIcon, SpeakerMuteIcon } from '../../components/PixelIcon/pixelIcons'
import { useSettingsStore } from '../../store/settingsStore'
import { playSound } from '../../utils/sound'
import styles from './VolumeControl.module.css'

const STEP = 5

/** Deslizador vertical estilo Windows 98 (arrastre con puntero y teclado). */
function VerticalSlider({
  value,
  onChange,
  onCommit,
}: {
  value: number
  onChange: (value: number) => void
  onCommit: () => void
}) {
  const track = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const fromPointer = (clientY: number) => {
    const rect = track.current?.getBoundingClientRect()
    if (!rect) return
    onChange(Math.round((1 - (clientY - rect.top) / rect.height) * 100))
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const delta: Record<string, number> = {
      ArrowUp: STEP,
      ArrowRight: STEP,
      ArrowDown: -STEP,
      ArrowLeft: -STEP,
      PageUp: 20,
      PageDown: -20,
    }
    if (e.key in delta) onChange(value + delta[e.key])
    else if (e.key === 'Home') onChange(0)
    else if (e.key === 'End') onChange(100)
    else return
    e.preventDefault()
  }

  const onUp = (e: PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    onCommit()
  }

  return (
    <div
      ref={track}
      className={styles.slider}
      role="slider"
      tabIndex={0}
      aria-label="Volume"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      style={{ '--v': value } as React.CSSProperties}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        fromPointer(e.clientY)
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientY)}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKeyDown}
      onKeyUp={(e) => e.key.startsWith('Arrow') || e.key.startsWith('Page') ? onCommit() : undefined}
    >
      <div className={styles.groove} />
      <div className={styles.thumb} />
    </div>
  )
}

/** Icono de altavoz de la bandeja: abre el control de volumen. */
export default function VolumeControl() {
  const volume = useSettingsStore((s) => s.volume)
  const muted = useSettingsStore((s) => s.muted)
  const setVolume = useSettingsStore((s) => s.setVolume)
  const setMuted = useSettingsStore((s) => s.setMuted)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: globalThis.PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const silent = muted || volume === 0
  const Icon = silent ? SpeakerMuteIcon : SpeakerIcon

  return (
    <div ref={ref} className={styles.wrap}>
      <button
        type="button"
        className={`${styles.trayBtn} ${open ? styles.pressed : ''}`}
        aria-label={silent ? 'Volume (muted)' : `Volume ${volume}%`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon size={16} />
      </button>

      {open && (
        <div className={styles.popup} role="dialog" aria-label="Volume control">
          <span className={styles.title}>Volume</span>
          <VerticalSlider
            value={volume}
            onChange={(v) => {
              setVolume(v)
              if (muted && v > 0) setMuted(false)
            }}
            onCommit={() => playSound('ding')}
          />
          <label className={styles.mute}>
            <input
              type="checkbox"
              checked={muted}
              onChange={(e) => {
                setMuted(e.target.checked)
                if (!e.target.checked) queueMicrotask(() => playSound('ding'))
              }}
            />
            <span>Mute</span>
          </label>
        </div>
      )}
    </div>
  )
}
