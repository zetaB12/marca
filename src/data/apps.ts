import RecycleBinIcon from '../applications/RecycleBin/RecycleBinIcon'
import NMark from '../components/NLogo/NMark'
import {
  AboutIcon,
  ComputerIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  MailIcon,
  MinesweeperIcon,
  PowerIcon,
  ServicesIcon,
  SettingsIcon,
  TerminalIcon,
  type IconComponent,
} from '../components/PixelIcon/pixelIcons'

export type AppId =
  | 'home'
  | 'projects'
  | 'services'
  | 'about'
  | 'mycomputer'
  | 'sysprops'
  | 'notepad'
  | 'contact'
  | 'terminal'
  | 'minesweeper'
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
    title: 'Bienvenida',
    windowTitle: 'Bienvenida.exe',
    file: 'Bienvenida',
    icon: HomeIcon,
    windowIcon: NMark,
    size: { w: 920, h: 680 },
  },
  projects: {
    id: 'projects',
    title: 'Mis proyectos',
    windowTitle: 'Mis proyectos',
    file: 'Mis proyectos',
    icon: FolderIcon,
    size: { w: 760, h: 500 },
  },
  services: {
    id: 'services',
    title: 'Servicios',
    windowTitle: 'Servicios.exe',
    file: 'Servicios.exe',
    icon: ServicesIcon,
    size: { w: 720, h: 500 },
  },
  about: {
    id: 'about',
    title: 'Nosotros',
    windowTitle: 'Nosotros.exe',
    file: 'Nosotros.exe',
    icon: AboutIcon,
    size: { w: 640, h: 560 },
  },
  mycomputer: {
    id: 'mycomputer',
    title: 'Mi PC',
    windowTitle: 'Mi PC',
    file: 'Mi PC',
    icon: ComputerIcon,
    size: { w: 720, h: 500 },
  },
  /** Ventana independiente (Properties de My Computer); no tiene icono de escritorio ni entrada en Start. */
  sysprops: {
    id: 'sysprops',
    title: 'Propiedades del sistema',
    windowTitle: 'Mi PC — Propiedades del sistema',
    file: 'Propiedades del sistema',
    icon: ComputerIcon,
    size: { w: 560, h: 460 },
  },
  /** Visor de texto simple (Readme.txt y otros archivos de My Computer). */
  notepad: {
    id: 'notepad',
    title: 'Bloc de notas',
    windowTitle: 'Bloc de notas',
    file: 'Bloc de notas',
    icon: DocumentIcon,
    size: { w: 560, h: 420 },
  },
  contact: {
    id: 'contact',
    title: 'Contacto',
    windowTitle: 'Contacto.exe',
    file: 'Contacto.exe',
    icon: MailIcon,
    size: { w: 560, h: 480 },
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    windowTitle: 'Terminal - C:\\NEAL',
    file: 'Terminal',
    icon: TerminalIcon,
    size: { w: 760, h: 500 },
  },
  minesweeper: {
    id: 'minesweeper',
    title: 'Buscaminas',
    windowTitle: 'Buscaminas',
    file: 'Buscaminas',
    icon: MinesweeperIcon,
    size: { w: 340, h: 500 },
  },
  recyclebin: {
    id: 'recyclebin',
    title: 'Papelera de reciclaje',
    windowTitle: 'Papelera de reciclaje',
    file: 'Papelera de reciclaje',
    icon: RecycleBinIcon,
    size: { w: 700, h: 440 },
  },
  settings: {
    id: 'settings',
    title: 'Configuración',
    windowTitle: 'Configuración',
    file: 'Configuración',
    icon: SettingsIcon,
    size: { w: 480, h: 400 },
  },
  shutdown: {
    id: 'shutdown',
    title: 'Apagar',
    windowTitle: 'Apagar el sistema',
    file: 'Apagar',
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
  'terminal',
  'minesweeper',
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
  'terminal',
  'minesweeper',
  'recyclebin',
]

export const isWindowApp = (id: AppId): id is WindowAppId => id !== 'shutdown'
