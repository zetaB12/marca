import RecycleBinIcon from '../applications/RecycleBin/RecycleBinIcon'
import NMark from '../components/NLogo/NMark'
import {
  AboutIcon,
  ComputerIcon,
  FolderIcon,
  HomeIcon,
  MailIcon,
  PowerIcon,
  ServicesIcon,
  SettingsIcon,
  type IconComponent,
} from '../components/PixelIcon/pixelIcons'

export type AppId =
  | 'home'
  | 'projects'
  | 'services'
  | 'about'
  | 'mycomputer'
  | 'contact'
  | 'recyclebin'
  | 'settings'
  | 'shutdown'

/** Aplicaciones que abren ventana (shutdown es una acción, no una ventana). */
export type WindowAppId = Exclude<AppId, 'shutdown'>

export interface AppDef {
  id: AppId
  /** Nombre corto: menú Start y barra de tareas. */
  title: string
  /** Título de la barra de la ventana. */
  windowTitle: string
  /** Etiqueta del icono de escritorio. */
  file: string
  icon: IconComponent
  /** Icono de la barra de título si difiere del icono del menú. */
  windowIcon?: IconComponent
  /** Tamaño inicial preferido de la ventana (se ajusta al viewport). */
  size?: { w: number; h: number }
}

export const APPS: Record<AppId, AppDef> = {
  home: {
    id: 'home',
    title: 'Home',
    windowTitle: 'Welcome.exe',
    file: 'Home',
    icon: HomeIcon,
    windowIcon: NMark,
    size: { w: 920, h: 680 },
  },
  projects: {
    id: 'projects',
    title: 'My Projects',
    windowTitle: 'My Projects',
    file: 'My Projects',
    icon: FolderIcon,
    size: { w: 760, h: 500 },
  },
  services: {
    id: 'services',
    title: 'Services',
    windowTitle: 'Services.exe',
    file: 'Services.exe',
    icon: ServicesIcon,
    size: { w: 720, h: 500 },
  },
  about: {
    id: 'about',
    title: 'About Us',
    windowTitle: 'About Us.exe',
    file: 'About Us.exe',
    icon: AboutIcon,
    size: { w: 620, h: 480 },
  },
  mycomputer: {
    id: 'mycomputer',
    title: 'My Computer',
    windowTitle: 'My Computer — System Properties',
    file: 'My Computer',
    icon: ComputerIcon,
    size: { w: 560, h: 460 },
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    windowTitle: 'Contact.exe',
    file: 'Contact.exe',
    icon: MailIcon,
    size: { w: 520, h: 400 },
  },
  recyclebin: {
    id: 'recyclebin',
    title: 'Recycle Bin',
    windowTitle: 'Recycle Bin',
    file: 'Recycle Bin',
    icon: RecycleBinIcon,
    size: { w: 700, h: 440 },
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    windowTitle: 'Settings',
    file: 'Settings',
    icon: SettingsIcon,
    size: { w: 480, h: 400 },
  },
  shutdown: {
    id: 'shutdown',
    title: 'Shutdown',
    windowTitle: 'Shut Down',
    file: 'Shutdown',
    icon: PowerIcon,
  },
}

export const START_MENU_ITEMS: AppId[] = [
  'home',
  'projects',
  'services',
  'about',
  'mycomputer',
  'contact',
  'settings',
  'shutdown',
]

/** Inicio rápido de la barra de tareas (como el Quick Launch de Windows 98). */
export const QUICK_LAUNCH: WindowAppId[] = ['projects', 'services', 'contact']

export const DESKTOP_ICONS: WindowAppId[] = [
  'projects',
  'services',
  'about',
  'mycomputer',
  'contact',
  'recyclebin',
]

export const isWindowApp = (id: AppId): id is WindowAppId => id !== 'shutdown'
