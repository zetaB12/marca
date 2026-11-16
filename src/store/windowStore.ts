import type { IconComponent } from '../components/PixelIcon/pixelIcons'
import { create } from 'zustand'
import { APPS, type WindowAppId } from '../data/apps'
import { playSound } from '../utils/sound'
import { uiScale } from '../utils/uiScale'

export interface Point {
  x: number
  y: number
}
export interface Size {
  w: number
  h: number
}

/** Una ventana por aplicación (singleton): `id === appId`. */
export interface WindowState {
  id: WindowAppId
  appId: WindowAppId
  title: string
  icon: IconComponent
  /** Icono de la barra de título de la ventana. */
  titleIcon: IconComponent
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  isActive: boolean
  zIndex: number
  position: Point
  size: Size
  /** Orden de apertura: define el orden en la barra de tareas y en Alt+Tab. */
  order: number
}

const MIN_W = 320
const MIN_H = 220
const VISIBLE = 100 // píxeles de ventana que siempre deben quedar dentro del escritorio
const TITLEBAR_H = 34
const FALLBACK_SIZE = { w: 680, h: 540 }

const clamp = (v: number, min: number, max: number) => (max < min ? min : Math.min(Math.max(v, min), max))

export const clampSize = (s: Size, b: Size): Size => ({
  w: Math.min(Math.max(s.w, MIN_W), Math.max(b.w, 0) || s.w),
  h: Math.min(Math.max(s.h, MIN_H), Math.max(b.h, 0) || s.h),
})

export const clampPosition = (p: Point, s: Size, b: Size): Point => ({
  x: clamp(p.x, VISIBLE - s.w, b.w - VISIBLE),
  y: clamp(p.y, 0, b.h - TITLEBAR_H),
})

/** Activa la ventana visible con mayor z-index (o ninguna). */
function activateTop(windows: Record<string, WindowState>) {
  const visible = Object.values(windows).filter((w) => w.isOpen && !w.isMinimized)
  const top = visible.reduce<WindowState | null>((a, w) => (!a || w.zIndex > a.zIndex ? w : a), null)
  const next: Record<string, WindowState> = {}
  for (const w of Object.values(windows)) next[w.id] = { ...w, isActive: w.id === top?.id }
  return next
}

interface WindowStore {
  windows: Record<string, WindowState>
  /** Área disponible para ventanas (viewport menos la barra de tareas). */
  bounds: Size
  topZ: number
  orderCounter: number
  setBounds: (bounds: Size) => void
  openWindow: (appId: WindowAppId) => string
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  /** Restaura una ventana minimizada; si no lo está, sale del estado maximizado. */
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, position: Point) => void
  resizeWindow: (id: string, size: Size, position?: Point) => void
  toggleWindow: (appId: WindowAppId) => void
  cycleWindow: (direction?: 1 | -1) => void
  closeAll: () => void
}

const initialBounds = (): Size =>
  typeof window === 'undefined'
    ? FALLBACK_SIZE
    : { w: window.innerWidth, h: Math.max(window.innerHeight - 76, 0) }

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  bounds: initialBounds(),
  topZ: 0,
  orderCounter: 0,

  setBounds: (bounds) =>
    set((s) => {
      const windows: Record<string, WindowState> = {}
      for (const w of Object.values(s.windows)) {
        const size = clampSize(w.size, bounds)
        windows[w.id] = { ...w, size, position: clampPosition(w.position, size, bounds) }
      }
      return { bounds, windows }
    }),

  openWindow: (appId) => {
    const { windows, bounds, topZ, orderCounter } = get()
    const existing = windows[appId]
    const z = topZ + 1

    if (existing?.isOpen) {
      // Singleton: restaurar si está minimizada, y siempre darle el foco.
      set((s) => ({
        topZ: z,
        windows: activateTop({
          ...s.windows,
          [appId]: { ...existing, isMinimized: false, zIndex: z },
        }),
      }))
      return appId
    }

    const app = APPS[appId]
    // Reabrir una ventana cerrada conserva su última geometría.
    const base = app.size ?? FALLBACK_SIZE
    const k = uiScale(bounds.w) // en monitores grandes las ventanas se abren proporcionalmente mayores
    const size =
      existing?.size ??
      clampSize({ w: Math.round(base.w * k), h: Math.round(base.h * k) }, { w: bounds.w - 24, h: bounds.h - 24 })
    const openCount = Object.values(windows).filter((w) => w.isOpen).length
    const cascade = (openCount % 6) * 28
    const position = clampPosition(
      existing?.position ?? {
        x: (bounds.w - size.w) / 2 + cascade,
        y: (bounds.h - size.h) / 2 + cascade,
      },
      size,
      bounds,
    )

    const win: WindowState = {
      id: appId,
      appId,
      title: app.windowTitle,
      icon: app.icon,
      titleIcon: app.windowIcon ?? app.icon,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isActive: true,
      zIndex: z,
      position,
      size,
      order: orderCounter + 1,
    }
    set((s) => ({
      topZ: z,
      orderCounter: orderCounter + 1,
      windows: activateTop({ ...s.windows, [appId]: win }),
    }))
    playSound('open')
    return appId
  },

  closeWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w?.isOpen) return s
      playSound('close')
      return {
        windows: activateTop({
          ...s.windows,
          [id]: { ...w, isOpen: false, isMinimized: false, isMaximized: false },
        }),
      }
    }),

  minimizeWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w?.isOpen || w.isMinimized) return s
      playSound('tick')
      return { windows: activateTop({ ...s.windows, [id]: { ...w, isMinimized: true } }) }
    }),

  maximizeWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w?.isOpen) return s
      playSound('tick')
      return { topZ: s.topZ + 1, windows: activateTop({ ...s.windows, [id]: { ...w, isMaximized: true, isMinimized: false, zIndex: s.topZ + 1 } }) }
    }),

  restoreWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w?.isOpen) return s
      const z = s.topZ + 1
      playSound('tick')
      const next = w.isMinimized
        ? { ...w, isMinimized: false, zIndex: z }
        : { ...w, isMaximized: false, zIndex: z }
      return { topZ: z, windows: activateTop({ ...s.windows, [id]: next }) }
    }),

  focusWindow: (id) =>
    set((s) => {
      const w = s.windows[id]
      if (!w?.isOpen || w.isMinimized) return s
      const isTop = Object.values(s.windows).every((o) => !o.isOpen || o.isMinimized || o.zIndex <= w.zIndex)
      if (w.isActive && isTop) return s
      const z = s.topZ + 1
      return { topZ: z, windows: activateTop({ ...s.windows, [id]: { ...w, zIndex: z } }) }
    }),

  moveWindow: (id, position) =>
    set((s) => {
      const w = s.windows[id]
      if (!w || w.isMaximized) return s
      return { windows: { ...s.windows, [id]: { ...w, position: clampPosition(position, w.size, s.bounds) } } }
    }),

  resizeWindow: (id, size, position) =>
    set((s) => {
      const w = s.windows[id]
      if (!w || w.isMaximized) return s
      const nextSize = clampSize(size, s.bounds)
      return {
        windows: {
          ...s.windows,
          [id]: { ...w, size: nextSize, position: clampPosition(position ?? w.position, nextSize, s.bounds) },
        },
      }
    }),

  toggleWindow: (appId) => {
    const w = get().windows[appId]
    if (!w?.isOpen) get().openWindow(appId)
    else if (w.isMinimized) get().restoreWindow(appId)
    else if (w.isActive) get().minimizeWindow(appId)
    else get().focusWindow(appId)
  },

  cycleWindow: (direction = 1) => {
    const open = Object.values(get().windows)
      .filter((w) => w.isOpen)
      .sort((a, b) => a.order - b.order)
    if (open.length === 0) return
    const current = open.findIndex((w) => w.isActive)
    const next = open[(current + direction + open.length) % open.length]
    if (next.isMinimized) get().restoreWindow(next.id)
    else get().focusWindow(next.id)
  },

  closeAll: () =>
    set((s) => {
      const windows: Record<string, WindowState> = {}
      for (const w of Object.values(s.windows)) {
        windows[w.id] = { ...w, isOpen: false, isMinimized: false, isMaximized: false, isActive: false }
      }
      return { windows }
    }),
}))

/** Ventanas abiertas en orden de apertura (barra de tareas, Alt+Tab, diálogo de seguridad). */
export const selectOpenWindows = (windows: Record<string, WindowState>) =>
  Object.values(windows)
    .filter((w) => w.isOpen)
    .sort((a, b) => a.order - b.order)
