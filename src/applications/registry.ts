import type { ComponentType } from 'react'
import type { WindowAppId } from '../data/apps'
import AboutApp from './About/AboutApp'
import ContactApp from './Contact/ContactApp'
import MyComputerApp from './MyComputer/MyComputerApp'
import ProjectsApp from './Projects/ProjectsApp'
import RecycleBinApp from './RecycleBin/RecycleBinApp'
import ServicesApp from './Services/ServicesApp'
import SettingsApp from './Settings/SettingsApp'
import WelcomeApp from './Welcome/WelcomeApp'

/** Qué componente renderiza cada ventana. */
export const APP_COMPONENTS: Record<WindowAppId, ComponentType> = {
  home: WelcomeApp,
  projects: ProjectsApp,
  services: ServicesApp,
  about: AboutApp,
  mycomputer: MyComputerApp,
  contact: ContactApp,
  recyclebin: RecycleBinApp,
  settings: SettingsApp,
}
