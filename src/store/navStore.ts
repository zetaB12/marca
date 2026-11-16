import { create } from 'zustand'

export type AboutTab = 'behind' | 'agency' | 'process'

interface NavState {
  /** Servicio seleccionado en Services.exe (lo fija Welcome al abrir un servicio). */
  serviceId: string
  /** Pestaña visible en About Us.exe (Welcome abre "Behind N."). */
  aboutTab: AboutTab
  selectService: (id: string) => void
  setAboutTab: (tab: AboutTab) => void
}

export const useNavStore = create<NavState>((set) => ({
  serviceId: 'web',
  aboutTab: 'behind',
  selectService: (serviceId) => set({ serviceId }),
  setAboutTab: (aboutTab) => set({ aboutTab }),
}))
