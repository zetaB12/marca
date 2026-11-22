import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import { gsap } from 'gsap'
import WindowFrame from '../components/WindowFrame/WindowFrame'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSettingsStore } from '../store/settingsStore'
import { useWindowStore, type WindowState } from '../store/windowStore'
import ResizeHandles from './ResizeHandles'
import styles from './ManagedWindow.module.css'

interface Props {
  win: WindowState
  children: ReactNode
}

/** Posiciona, arrastra y redimensiona una ventana; el aspecto lo da WindowFrame. */
export default function ManagedWindow({ win, children }: Props) {
  const { id } = win
  const shellRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const mobile = useIsMobile()

  const focusWindow = useWindowStore((s) => s.focusWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const moveWindow = useWindowStore((s) => s.moveWindow)

  // El foco del teclado sigue a la ventana activa (sin robárselo a un control interno).
  useEffect(() => {
    const el = shellRef.current
    if (win.isActive && !win.isMinimized && el && !el.contains(document.activeElement)) {
      el.focus({ preventScroll: true })
    }
  }, [win.isActive, win.isMinimized])

  const animations = useSettingsStore((s) => s.animations)
  // Cierre con un fundido corto; sin animaciones (o con "reducir movimiento") se cierra al instante.
  const closeSmoothly = () => {
    const el = shellRef.current
    if (!el || !animations || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return closeWindow(id)
    gsap.to(el, { opacity: 0, scale: 0.96, duration: 0.14, ease: 'power1.in', onComplete: () => closeWindow(id) })
  }

  const toggleMaximize = () => (win.isMaximized ? restoreWindow(id) : maximizeWindow(id))

  const onTitleDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || mobile || win.isMaximized) return
    if ((e.target as HTMLElement).closest('button')) return // no arrastrar desde los botones
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, x: win.position.x, y: win.position.y }
  }
  const onTitleMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current
    if (d) moveWindow(id, { x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py })
  }
  const onTitleUp = (e: PointerEvent<HTMLElement>) => {
    drag.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const classes = [
    styles.shell,
    win.isMinimized ? styles.minimized : '',
    win.isMaximized ? styles.maximized : '',
  ].join(' ')

  return (
    <div
      ref={shellRef}
      className={classes}
      tabIndex={-1}
      style={{
        zIndex: win.zIndex,
        left: win.position.x,
        top: win.position.y,
        width: win.size.w,
        height: win.size.h,
      }}
      onPointerDownCapture={() => focusWindow(id)}
    >
      <WindowFrame
        title={win.title}
        icon={<win.titleIcon size={16} />}
        active={win.isActive}
        labelId={`win-${id}-title`}
        maximized={win.isMaximized}
        onMinimize={() => minimizeWindow(id)}
        onToggleMaximize={toggleMaximize}
        onClose={closeSmoothly}
        className={styles.frame}
        titlebarProps={{
          onPointerDown: onTitleDown,
          onPointerMove: onTitleMove,
          onPointerUp: onTitleUp,
          onPointerCancel: onTitleUp,
          onDoubleClick: (e) => {
            if (!mobile && !(e.target as HTMLElement).closest('button')) toggleMaximize()
          },
        }}
      >
        {children}
      </WindowFrame>
      {!win.isMaximized && !mobile && <ResizeHandles id={id} />}
    </div>
  )
}
