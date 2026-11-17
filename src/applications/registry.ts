import type { ComponentType } from 'react'
import type { WindowAppId } from '../data/apps'
import AboutApp from './About/AboutApp'
import ContactApp from './Contact/ContactApp'
import MyComputerApp from './MyComputer/MyComputerApp'
import SystemPropertiesApp from './MyComputer/SystemPropertiesApp'
import NotepadApp from './Notepad/NotepadApp'
import ProjectsApp from './Projects/ProjectsApp'
import RecycleBinApp from './RecycleBin/RecycleBinApp'
import ServicesApp from './Services/ServicesApp'
import SettingsApp from './Settings/SettingsApp'
import TerminalApp from './Terminal/TerminalApp'
import WelcomeApp from './Welcome/WelcomeApp'

/** Qué componente renderiza cada ventana. */
export const APP_COMPONENTS: Record<WindowAppId, ComponentType> = {
  home: WelcomeApp,
  projects: ProjectsApp,
  services: ServicesApp,
  about: AboutApp,
  mycomputer: MyComputerApp,
  sysprops: SystemPropertiesApp,
  notepad: NotepadApp,
  contact: ContactApp,
  terminal: TerminalApp,
  recyclebin: RecycleBinApp,
  settings: SettingsApp,
}
