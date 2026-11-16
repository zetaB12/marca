import { create } from 'zustand'
import { isWindowApp, type AppId } from '../data/apps'
import { SHOW_PRELOADER } from '../utils/bootMode'
import { useRecycleStore } from './recycleStore'
import { useSettingsStore, type SettingsTab } from './settingsStore'
import { useWindowStore } from './windowStore'

/** Pausa entre que el escritorio aparece y se abre la ventana de bienvenida (simula el arranque de Windows 98). */
export const WELCOME_DELAY_MS = 800

export type DialogId = 'shutdown' | 'security'

interface DesktopState {
  booted: boolean // el preloader terminó y el escritorio se revela
  startOpen: boolean
  selectedIcon: AppId | null
  /** `target` identifica el icono sobre el que se abrió (si no, es el menú del escritorio). */
  contextMenu: { x: number; y: number; target?: 'mycomputer' } | null
  dialog: DialogId | null
  setBooted: () => void
  toggleStart: () => void
  setStart: (open: boolean) => void
  closeStart: () => void
  selectIcon: (id: AppId | null) => void
  openContextMenu: (x: number, y: number, target?: 'mycomputer') => void
  closeContextMenu: () => void
  openDialog: (dialog: DialogId) => void
  closeDialog: () => void
  /** Abre una aplicación (o ejecuta su acción) y cierra los menús. */
  launch: (id: AppId) => void
  openSettings: (tab: SettingsTab) => void
  refresh: () => void
  /** Reinicia el escritorio: cierra todo y, tras la pausa de arranque, vuelve a abrir Home. */
  restart: () => void
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  booted: !SHOW_PRELOADER, // sin preloader (recarga) el escritorio ya está listo
  startOpen: false,
  selectedIcon: null,
  contextMenu: null,
  dialog: null,
  setBooted: () => set({ booted: true }),
  toggleStart: () => set((s) => ({ startOpen: !s.startOpen, contextMenu: null })),
  setStart: (startOpen) => set({ startOpen, contextMenu: null }),
  closeStart: () => set({ startOpen: false }),
  selectIcon: (selectedIcon) => set({ selectedIcon }),
  openContextMenu: (x, y, target) => set({ contextMenu: { x, y, target }, startOpen: false }),
  closeContextMenu: () => set({ contextMenu: null }),
  openDialog: (dialog) => set({ dialog, startOpen: false, contextMenu: null }),
  closeDialog: () => set({ dialog: null }),
  launch: (id) => {
    set({ startOpen: false, contextMenu: null })
    if (isWindowApp(id)) useWindowStore.getState().openWindow(id)
    else get().openDialog('shutdown')
  },
  openSettings: (tab) => {
    useSettingsStore.getState().setTab(tab)
    get().launch('settings')
  },
  /** Refresh del escritorio: recarga la página de verdad (como F5), sin pasar otra vez por el preloader. */
  refresh: () => {
    set({ contextMenu: null, startOpen: false, selectedIcon: null })
    window.location.reload()
  },
  restart: () => {
    const windows = useWindowStore.getState()
    windows.closeAll()
    useRecycleStore.getState().reset()
    window.setTimeout(() => useWindowStore.getState().openWindow('home'), WELCOME_DELAY_MS)
    set({ dialog: null, startOpen: false, contextMenu: null, selectedIcon: null })
  },
}))
