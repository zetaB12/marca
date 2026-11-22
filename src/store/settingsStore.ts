import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type SettingsTab = 'display' | 'preferences'
/** Fondo del escritorio: automático (hora de Lima) o fijo en un período. */
export type WallpaperMode = 'auto' | 'morning' | 'afternoon' | 'sunset' | 'night'

interface SettingsState {
  /** Patrón de puntos del fondo del escritorio. */
  pattern: boolean
  /** Animaciones de la interfaz (ventanas, menús, efectos). */
  animations: boolean
  /** Volumen de los sonidos de la interfaz (0-100). */
  volume: number
  muted: boolean
  wallpaperMode: WallpaperMode
  tab: SettingsTab
  setPattern: (value: boolean) => void
  setAnimations: (value: boolean) => void
  setVolume: (value: number) => void
  setMuted: (value: boolean) => void
  setWallpaperMode: (mode: WallpaperMode) => void
  setTab: (tab: SettingsTab) => void
  reset: () => void
}

const DEFAULTS = { pattern: true, animations: true, volume: 60, muted: false, wallpaperMode: 'auto' as WallpaperMode }

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      tab: 'preferences',
      setPattern: (pattern) => set({ pattern }),
      setAnimations: (animations) => set({ animations }),
      setVolume: (volume) => set({ volume: Math.min(100, Math.max(0, Math.round(volume))) }),
      setMuted: (muted) => set({ muted }),
      setWallpaperMode: (wallpaperMode) => set({ wallpaperMode }),
      setTab: (tab) => set({ tab }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'ndigital-settings',
      // Si el navegador bloquea localStorage, createJSONStorage degrada a memoria sin romper.
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        pattern: s.pattern,
        animations: s.animations,
        volume: s.volume,
        muted: s.muted,
        wallpaperMode: s.wallpaperMode,
      }),
    },
  ),
)
