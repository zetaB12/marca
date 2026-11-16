import { useEffect, useRef } from 'react'
import { ComputerIcon, FolderIcon, OpenFolderIcon, PowerIcon, RefreshIcon, SettingsIcon } from '../../components/PixelIcon/pixelIcons'
import { useDesktopStore } from '../../store/desktopStore'
import { useExplorerStore } from '../../store/explorerStore'
import styles from './ContextMenu.module.css'

const WIDTH = 240
const HEIGHT = 4 * 48 + 12 // estimación para no salirse del viewport

/** Menú contextual del escritorio (clic derecho). */
export default function ContextMenu() {
  const menu = useDesktopStore((s) => s.contextMenu)
  const { closeContextMenu, refresh, setStart, openSettings } = useDesktopStore.getState()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu) return
    // El foco va al contenedor, no a la primera opción: así ninguna opción aparece resaltada hasta
    // que el mouse (o el teclado) la elige.
    ref.current?.focus({ preventScroll: true })
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) closeContextMenu()
    }
    document.addEventListener('pointerdown', onPointer)
    window.addEventListener('blur', closeContextMenu)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('blur', closeContextMenu)
    }
  }, [menu, closeContextMenu])

  if (!menu) return null

  const x = Math.max(8, Math.min(menu.x, window.innerWidth - WIDTH - 8))
  const y = Math.max(8, Math.min(menu.y, window.innerHeight - HEIGHT - 8))

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    const down = e.key === 'ArrowDown'
    const next = i < 0 ? (down ? 0 : items.length - 1) : (i + (down ? 1 : -1) + items.length) % items.length
    items[next]?.focus()
    e.preventDefault()
  }

  const run = (action: () => void) => () => {
    closeContextMenu()
    action()
  }

  // Menú del icono My Computer: Open conserva la ruta actual; Explore abre en la carpeta principal.
  if (menu.target === 'mycomputer') {
    const { launch } = useDesktopStore.getState()
    return (
      <div
        ref={ref}
        className={styles.menu}
        style={{ left: x, top: y, width: WIDTH }}
        role="menu"
        aria-label="My Computer"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onMouseOver={(e) => (e.target as HTMLElement).closest('button')?.focus()}
        onMouseLeave={() => ref.current?.focus()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <button type="button" role="menuitem" className={styles.item} onClick={run(() => launch('mycomputer'))}>
          <OpenFolderIcon size={16} /> Open
        </button>
        <button
          type="button"
          role="menuitem"
          className={styles.item}
          onClick={run(() => {
            useExplorerStore.getState().explore()
            launch('mycomputer')
          })}
        >
          <FolderIcon size={16} /> Explore
        </button>
        <hr className={styles.sep} />
        <button type="button" role="menuitem" className={styles.item} onClick={run(() => launch('sysprops'))}>
          <ComputerIcon size={16} /> Properties
        </button>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={styles.menu}
      style={{ left: x, top: y, width: WIDTH }}
      role="menu"
      aria-label="Desktop"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      // El resaltado sigue al mouse: la opción bajo el puntero toma el foco (una sola resaltada).
      onMouseOver={(e) => (e.target as HTMLElement).closest('button')?.focus()}
      onMouseLeave={() => ref.current?.focus()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button type="button" role="menuitem" className={`${styles.item} ${styles.mono}`} onClick={run(refresh)}>
        <RefreshIcon size={16} /> Refresh
      </button>
      <button type="button" role="menuitem" className={`${styles.item} ${styles.mono}`} onClick={run(() => setStart(true))}>
        <PowerIcon size={16} /> Open Start Menu
      </button>
      <hr className={styles.sep} />
      <button type="button" role="menuitem" className={styles.item} onClick={run(() => openSettings('preferences'))}>
        <SettingsIcon size={16} /> Settings
      </button>
      <button type="button" role="menuitem" className={styles.item} onClick={run(() => openSettings('display'))}>
        <ComputerIcon size={16} /> Display Options
      </button>
    </div>
  )
}
