import { create } from 'zustand'
import { HOME_PATH, findNode, nodesOf, type FsNode } from '../data/filesystem'
import { useWindowStore } from './windowStore'

export type ExplorerView = 'icons' | 'list'
export type ExplorerSort = 'name' | 'type'

interface ExplorerState {
  /** Historial de rutas (ids desde la unidad) y posición actual. */
  history: string[][]
  index: number
  view: ExplorerView
  sort: ExplorerSort
  selectedId: string | null
  /** Archivo abierto en el Bloc de notas. */
  fileId: string | null
  navigate: (path: string[]) => void
  back: () => void
  forward: () => void
  up: () => void
  select: (id: string | null) => void
  setView: (view: ExplorerView) => void
  setSort: (sort: ExplorerSort) => void
  /** Abre un elemento: carpeta (navega), acceso directo (abre su app) o archivo (Bloc de notas). */
  openNode: (node: FsNode) => void
  /** Vuelve a la carpeta principal con historial limpio (Explore). */
  explore: () => void
  refresh: () => void
}

export const selectPath = (s: ExplorerState) => s.history[s.index]

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  history: [HOME_PATH],
  index: 0,
  view: 'icons',
  sort: 'name',
  selectedId: null,
  fileId: null,

  navigate: (path) =>
    set((s) => {
      const current = s.history[s.index]
      if (path.join('/') === current.join('/') || nodesOf(path).length !== path.length) return s
      const history = [...s.history.slice(0, s.index + 1), path]
      return { history, index: history.length - 1, selectedId: null }
    }),

  back: () => set((s) => (s.index > 0 ? { index: s.index - 1, selectedId: null } : s)),
  forward: () => set((s) => (s.index < s.history.length - 1 ? { index: s.index + 1, selectedId: null } : s)),
  up: () => {
    const path = selectPath(get())
    if (path.length > 1) get().navigate(path.slice(0, -1))
  },

  select: (selectedId) => set({ selectedId }),
  setView: (view) => set({ view }),
  setSort: (sort) => set({ sort }),

  openNode: (node) => {
    if (node.children) {
      get().navigate([...selectPath(get()), node.id])
    } else if (node.opens) {
      useWindowStore.getState().openWindow(node.opens)
    } else if (node.content !== undefined && findNode(node.id)) {
      set({ fileId: node.id })
      useWindowStore.getState().openWindow('notepad')
    }
  },

  explore: () => set({ history: [HOME_PATH], index: 0, selectedId: null }),
  refresh: () => set({ selectedId: null }),
}))
