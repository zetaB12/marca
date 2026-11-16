import { useRef, type PointerEvent } from 'react'
import { useWindowStore, type Point, type Size } from '../store/windowStore'
import styles from './ManagedWindow.module.css'

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const DIRS: Dir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
const MIN_W = 320
const MIN_H = 220

interface Origin {
  px: number
  py: number
  pos: Point
  size: Size
}

/** Ocho tiradores de redimensionado con captura de puntero (sin listeners globales). */
export default function ResizeHandles({ id }: { id: string }) {
  const origin = useRef<Origin | null>(null)

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const w = useWindowStore.getState().windows[id]
    if (!w) return
    e.currentTarget.setPointerCapture(e.pointerId)
    origin.current = { px: e.clientX, py: e.clientY, pos: w.position, size: w.size }
    e.preventDefault()
  }

  const onMove = (dir: Dir) => (e: PointerEvent<HTMLDivElement>) => {
    const o = origin.current
    if (!o) return
    const dx = e.clientX - o.px
    const dy = e.clientY - o.py
    let { x, y } = o.pos
    let { w, h } = o.size
    if (dir.includes('e')) w = o.size.w + dx
    if (dir.includes('s')) h = o.size.h + dy
    if (dir.includes('w')) {
      w = Math.max(o.size.w - dx, MIN_W)
      x = o.pos.x + (o.size.w - w)
    }
    if (dir.includes('n')) {
      h = Math.max(o.size.h - dy, MIN_H)
      y = o.pos.y + (o.size.h - h)
    }
    useWindowStore.getState().resizeWindow(id, { w, h }, { x, y })
  }

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    origin.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <>
      {DIRS.map((dir) => (
        <div
          key={dir}
          className={`${styles.handle} ${styles[`h_${dir}`]}`}
          onPointerDown={onDown}
          onPointerMove={onMove(dir)}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-hidden
        />
      ))}
    </>
  )
}
