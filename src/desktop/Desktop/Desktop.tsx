import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react'
import { gsap } from 'gsap'
import Wallpaper from '../../components/Wallpaper/Wallpaper'
import { DESKTOP_ICONS } from '../../data/apps'
import { useDesktopStore } from '../../store/desktopStore'
import { useSettingsStore } from '../../store/settingsStore'
import DesktopIcon from './DesktopIcon'
import SystemStatus from './SystemStatus'
import styles from './Desktop.module.css'

export default function Desktop() {
  const selectIcon = useDesktopStore((s) => s.selectIcon)
  const openContextMenu = useDesktopStore((s) => s.openContextMenu)
  const animations = useSettingsStore((s) => s.animations)
  const booted = useDesktopStore((s) => s.booted)
  const wallRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)
  const motionOk = () => animations && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // CAPA 2: los iconos aparecen de uno en uno cuando el escritorio se revela.
  useLayoutEffect(() => {
    const box = iconsRef.current
    if (!booted || !box || !motionOk()) return
    const tween = gsap.from(box.children, { opacity: 0, y: 10, duration: 0.35, stagger: 0.07, delay: 0.1, ease: 'power2.out', clearProps: 'all' })
    return () => {
      tween.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted])

  // Parallax suave con el puntero (solo ratón): se mueve únicamente el fondo; los iconos quedan quietos.
  useEffect(() => {
    const wall = wallRef.current
    if (!booted || !wall || !motionOk() || !window.matchMedia('(pointer: fine)').matches) return
    const opts = { duration: 1.2, ease: 'power3.out' }
    const wx = gsap.quickTo(wall, 'x', opts)
    const wy = gsap.quickTo(wall, 'y', opts)
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      wx(-nx * 16)
      wy(-ny * 10)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      gsap.set(wall, { x: 0, y: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted, animations])

  // En táctil no hay clic derecho: mantener pulsado sobre el escritorio abre el mismo menú.
  const press = useRef<{ timer: number; x: number; y: number } | null>(null)
  const cancelPress = () => {
    if (press.current) window.clearTimeout(press.current.timer)
    press.current = null
  }

  // Flechas: mueven el foco (y la selección) entre iconos. Enter/Espacio los abre (clic nativo).
  const onIconKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, 1 | -1> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    const step = keys[e.key]
    if (!step) return
    const icons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button')]
    const i = icons.indexOf(document.activeElement as HTMLButtonElement)
    icons[(i + step + icons.length) % icons.length]?.focus()
    e.preventDefault()
  }

  return (
    <main
      id="desktop"
      className={styles.desktop}
      onPointerDown={(e) => {
        if (e.target !== e.currentTarget) return
        selectIcon(null)
        if (e.pointerType === 'touch') {
          const { clientX: x, clientY: y } = e
          cancelPress()
          press.current = {
            x,
            y,
            timer: window.setTimeout(() => {
              press.current = null
              openContextMenu(x, y)
            }, 550),
          }
        }
      }}
      onPointerMove={(e) => {
        const p = press.current
        if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) cancelPress()
      }}
      onPointerUp={cancelPress}
      onPointerCancel={cancelPress}
      onContextMenu={(e) => {
        e.preventDefault()
        openContextMenu(e.clientX, e.clientY)
      }}
    >
      <Wallpaper layerRef={wallRef} />
      <div ref={iconsRef} className={styles.icons} onKeyDown={onIconKeys}>
        {DESKTOP_ICONS.map((id) => (
          <DesktopIcon key={id} id={id} />
        ))}
      </div>
      <div className={styles.status}>
        <SystemStatus />
      </div>
    </main>
  )
}
