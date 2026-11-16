import { useRef, type KeyboardEvent } from 'react'
import { DESKTOP_ICONS } from '../../data/apps'
import { useDesktopStore } from '../../store/desktopStore'
import { useSettingsStore } from '../../store/settingsStore'
import DesktopIcon from './DesktopIcon'
import SystemStatus from './SystemStatus'
import styles from './Desktop.module.css'

export default function Desktop() {
  const selectIcon = useDesktopStore((s) => s.selectIcon)
  const openContextMenu = useDesktopStore((s) => s.openContextMenu)
  const pattern = useSettingsStore((s) => s.pattern)
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
      className={`${styles.desktop} ${pattern ? '' : styles.plain}`}
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
      <div className={styles.icons} onKeyDown={onIconKeys}>
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
