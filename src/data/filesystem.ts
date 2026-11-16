import {
  AboutIcon,
  ComputerIcon,
  DocumentIcon,
  FlaskIcon,
  FolderIcon,
  MailIcon,
  ServicesIcon,
  type IconComponent,
} from '../components/PixelIcon/pixelIcons'
import type { WindowAppId } from './apps'
import { PROJECTS } from './projects'
import { SERVICES } from './services'

/**
 * Sistema de archivos virtual de My Computer: única fuente de datos del explorador.
 * - `folder`/`drive`: contienen `children`.
 * - `shortcut`: abre la aplicación indicada en `opens`.
 * - `file`: se abre en el Bloc de notas con `content`.
 * El contenido que aún no existe es un marcador, identificado como tal en `description`.
 */
export type FsNodeType = 'drive' | 'folder' | 'file' | 'shortcut'

export interface FsNode {
  id: string
  name: string
  type: FsNodeType
  icon: IconComponent
  description: string
  children?: FsNode[]
  opens?: WindowAppId
  content?: string
}

export const TYPE_LABEL: Record<FsNodeType, string> = {
  drive: 'Local Disk',
  folder: 'File Folder',
  file: 'Text Document',
  shortcut: 'Shortcut',
}

const README = `N. DIGITAL STUDIO
=================

Bienvenido a Neal OS 1.0.0.

N. Digital Studio crea soluciones digitales para negocios: desarrollo web, e-commerce, software y sistemas, automatización e inteligencia artificial.


COMO EXPLORAR
-------------
* Doble clic en una carpeta para abrirla
  (en pantallas tactiles, un toque).
* Back, Forward y Up para moverte; la ruta
  tambien es clicable.
* Clic derecho (o mantener pulsado en un
  espacio vacio) abre el menu contextual.
* Los accesos directos abren la aplicacion
  correspondiente.
* Properties muestra las propiedades del
  sistema.


CARPETAS
--------
Services     Servicios que ofrece el estudio.
Projects     Proyectos (hoy: demos).
About        Sobre N. Digital Studio.
Contact      Como solicitar un proyecto.
Experiments  Demos e innovaciones.


NOTA
----
Los elementos marcados DEMO o Placeholder son marcadores hasta contar con informacion real.
`

const SERVICE_NAMES: [id: string, name: string][] = [
  ['web', 'Web Development'],
  ['ecommerce', 'E-commerce'],
  ['software', 'Software & Systems'],
  ['automation', 'Automation'],
  ['ai', 'AI Solutions'],
]

const serviceNodes: FsNode[] = SERVICE_NAMES.flatMap(([id, name]) => {
  const service = SERVICES.find((s) => s.id === id)
  if (!service) return []
  return [
    {
      id: `service-${id}`,
      name,
      type: 'shortcut' as const,
      icon: service.icon,
      description: service.description,
      opens: 'services' as const,
    },
  ]
})

const projectNodes: FsNode[] = PROJECTS.map((p) => ({
  id: `project-${p.id}`,
  name: p.name,
  type: 'shortcut' as const,
  icon: FolderIcon,
  description: p.demo ? `${p.description} (DEMO)` : p.description,
  opens: 'projects' as const,
}))

export const DRIVE_ID = 'c'
export const STUDIO_ID = 'n-digital-studio'

export const ROOT: FsNode = {
  id: DRIVE_ID,
  name: 'C:',
  type: 'drive',
  icon: ComputerIcon,
  description: 'Local disk of Neal OS.',
  children: [
    {
      id: STUDIO_ID,
      name: 'N-DIGITAL-STUDIO',
      type: 'folder',
      icon: FolderIcon,
      description: 'Main folder of N. Digital Studio.',
      children: [
        {
          id: 'services',
          name: 'Services',
          type: 'folder',
          icon: ServicesIcon,
          description: 'Services offered by N. Digital Studio.',
          children: [
            {
              id: 'services-app',
              name: 'Services.exe',
              type: 'shortcut',
              icon: ServicesIcon,
              description: 'Opens the Services application.',
              opens: 'services',
            },
            ...serviceNodes,
          ],
        },
        {
          id: 'projects',
          name: 'Projects',
          type: 'folder',
          icon: FolderIcon,
          description: 'Projects, images, descriptions and links. Placeholder content (DEMO) until real cases are added.',
          children: [
            {
              id: 'projects-app',
              name: 'My Projects',
              type: 'shortcut',
              icon: FolderIcon,
              description: 'Opens the My Projects application.',
              opens: 'projects',
            },
            ...projectNodes,
          ],
        },
        {
          id: 'about',
          name: 'About',
          type: 'folder',
          icon: AboutIcon,
          description: 'About N. Digital Studio: philosophy and technology approach.',
          children: [
            {
              id: 'about-app',
              name: 'About Us.exe',
              type: 'shortcut',
              icon: AboutIcon,
              description: 'Opens the About Us application.',
              opens: 'about',
            },
          ],
        },
        {
          id: 'contact',
          name: 'Contact',
          type: 'folder',
          icon: MailIcon,
          description: 'Contact information and how to request a project.',
          children: [
            {
              id: 'contact-app',
              name: 'Contact.exe',
              type: 'shortcut',
              icon: MailIcon,
              description: 'Opens the Contact application.',
              opens: 'contact',
            },
          ],
        },
        {
          id: 'experiments',
          name: 'Experiments',
          type: 'folder',
          icon: FlaskIcon,
          description: 'Demos, experiments and technology innovations.',
          children: [
            {
              id: 'experiments-note',
              name: 'Placeholder.txt',
              type: 'file',
              icon: DocumentIcon,
              description: 'Placeholder: no experiments published yet.',
              content:
                'PLACEHOLDER\n===========\n\nEsta carpeta esta reservada para demos, experimentos e innovaciones tecnologicas.\n\nTodavia no hay experimentos publicados.\n',
            },
          ],
        },
        {
          id: 'readme',
          name: 'Readme.txt',
          type: 'file',
          icon: DocumentIcon,
          description: 'Introduction to N. Digital Studio and how to explore the system.',
          content: README,
        },
      ],
    },
  ],
}

export const HOME_PATH: string[] = [DRIVE_ID, STUDIO_ID]

const INDEX = new Map<string, { node: FsNode; path: string[] }>()
const walk = (node: FsNode, path: string[]) => {
  const here = [...path, node.id]
  INDEX.set(node.id, { node, path: here })
  node.children?.forEach((c) => walk(c, here))
}
walk(ROOT, [])

export const findNode = (id: string): FsNode | null => INDEX.get(id)?.node ?? null
export const findPath = (id: string): string[] | null => INDEX.get(id)?.path ?? null

/** Nodos de una ruta (ids desde la unidad); se corta en el primer id inexistente. */
export function nodesOf(path: string[]): FsNode[] {
  const nodes: FsNode[] = []
  for (const id of path) {
    const n = findNode(id)
    if (!n) break
    nodes.push(n)
  }
  return nodes
}

/** "C:\N-DIGITAL-STUDIO\Services" */
export function pathLabel(path: string[]): string {
  const names = nodesOf(path).map((n) => n.name)
  return names.length <= 1 ? `${names[0] ?? ''}\\` : `${names[0]}\\${names.slice(1).join('\\')}`
}
