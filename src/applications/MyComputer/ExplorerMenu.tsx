import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import menu from '../../desktop/ContextMenu/ContextMenu.module.css'
import styles from './MyComputerApp.module.css'

export type MenuEntry =
  | { kind: 'item'; label: string; icon?: ReactNode; checked?: boolean; onSelect: () => void }
  | { kind: 'heading'; label: string }
  | { kind: 'sep' }

const WIDTH = 220

/** Menú contextual del explorador. Se pinta en el body para no depender del transform de la ventana. */
export default function ExplorerMenu({
  x,
  y,
  label,
  entries,
  onClose,
}: {
  x: number
  y: number
  label: string
  entries: MenuEntry[]
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    window.addEventListener('blur', onClose)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('blur', onClose)
    }
  }, [onClose])

  const height = entries.length * 36 + 12
  const left = Math.max(8, Math.min(x, window.innerWidth - WIDTH - 8))
  const top = Math.max(8, Math.min(y, window.innerHeight - height - 8))

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    const down = e.key === 'ArrowDown'
    items[i < 0 ? (down ? 0 : items.length - 1) : (i + (down ? 1 : -1) + items.length) % items.length]?.focus()
    e.preventDefault()
  }

  return createPortal(
    <div
      ref={ref}
      className={menu.menu}
      style={{ left, top, width: WIDTH }}
      role="menu"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onMouseOver={(e) => (e.target as HTMLElement).closest('button')?.focus()}
      onMouseLeave={() => ref.current?.focus()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {entries.map((entry, i) => {
        if (entry.kind === 'sep') return <hr key={i} className={menu.sep} />
        if (entry.kind === 'heading')
          return (
            <div key={i} className={styles.menuHeading}>
              {entry.label}
            </div>
          )
        return (
          <button
            key={i}
            type="button"
            role={entry.checked === undefined ? 'menuitem' : 'menuitemradio'}
            aria-checked={entry.checked}
            className={menu.item}
            style={{ minHeight: 34 }}
            onClick={() => {
              onClose()
              entry.onSelect()
            }}
          >
            {entry.checked !== undefined ? (
              <span className={styles.radio} data-on={entry.checked || undefined} aria-hidden />
            ) : (
              entry.icon
            )}
            {entry.label}
          </button>
        )
      })}
    </div>,
    document.body,
  )
}
