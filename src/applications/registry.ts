import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { WindowAppId } from '../data/apps'
import WelcomeApp from './Welcome/WelcomeApp'

type AppComponent = ComponentType | LazyExoticComponent<ComponentType>

/** Cada aplicación se descarga al abrirla por primera vez (Bienvenida va en el paquete inicial). */
const loaders: Record<Exclude<WindowAppId, 'home'>, () => Promise<{ default: ComponentType }>> = {
  projects: () => import('./Projects/ProjectsApp'),
  services: () => import('./Services/ServicesApp'),
  about: () => import('./About/AboutApp'),
  mycomputer: () => import('./MyComputer/MyComputerApp'),
  sysprops: () => import('./MyComputer/SystemPropertiesApp'),
  notepad: () => import('./Notepad/NotepadApp'),
  contact: () => import('./Contact/ContactApp'),
  terminal: () => import('./Terminal/TerminalApp'),
  minesweeper: () => import('./Minesweeper/MinesweeperApp'),
  recyclebin: () => import('./RecycleBin/RecycleBinApp'),
  settings: () => import('./Settings/SettingsApp'),
}

/** Qué componente renderiza cada ventana. */
export const APP_COMPONENTS = {
  home: WelcomeApp,
  ...Object.fromEntries(Object.entries(loaders).map(([id, load]) => [id, lazy(load)])),
} as unknown as Record<WindowAppId, AppComponent>

/** Descarga el resto de aplicaciones cuando el navegador está libre, para que abrirlas sea instantáneo. */
export function prefetchApps() {
  const run = () => Object.values(loaders).forEach((load) => void load().catch(() => undefined))
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2000)
}
