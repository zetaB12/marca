import { create } from 'zustand'
import { BIN_ITEMS, type BinItem } from '../data/recycleBin'

interface RecycleState {
  items: BinItem[]
  selectedId: string | null
  select: (id: string | null) => void
  remove: (id: string) => void
  empty: () => void
  /** Devuelve el contenido original (al reiniciar el escritorio). */
  reset: () => void
}

export const useRecycleStore = create<RecycleState>((set) => ({
  items: BIN_ITEMS,
  selectedId: null,
  select: (selectedId) => set({ selectedId }),
  remove: (id) =>
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  empty: () => set({ items: [], selectedId: null }),
  reset: () => set({ items: BIN_ITEMS, selectedId: null }),
}))
