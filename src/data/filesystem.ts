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
  drive: 'Disco local',
  folder: 'Carpeta de archivos',
  file: 'Documento de texto',
  shortcut: 'Acceso directo',
}

const README = `Digital Studio
=================

Bienvenido a Neal OS 1.0.1.

Digital Studio crea soluciones digitales para negocios: desarrollo web, e-commerce, software y sistemas, automatización e inteligencia artificial.


CÓMO EXPLORAR
-------------
* Haz doble clic en una carpeta para abrirla
  (en pantallas táctiles, basta un toque).
* Usa Atrás, Adelante y Subir para moverte.
  La ruta de arriba también se puede pulsar.
* Clic derecho (o mantén pulsado en un espacio
  vacío) para abrir el menú contextual.
* Los accesos directos abren la aplicación
  correspondiente.
* El botón Propiedades muestra las propiedades
  del sistema.


CARPETAS
--------
Servicios     Lo que ofrece el estudio.
Proyectos     Proyectos (por ahora, demos).
Nosotros      Sobre Digital Studio.
Contacto      Cómo solicitar un proyecto.
Experimentos  Demos e innovaciones.


NOTA
----
Lo marcado como DEMO o Pendiente es un marcador hasta tener información real.
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
  description: 'Disco local de Neal OS.',
  children: [
    {
      id: STUDIO_ID,
      name: 'N-DIGITAL-STUDIO',
      type: 'folder',
      icon: FolderIcon,
      description: 'Carpeta principal de Digital Studio.',
      children: [
        {
          id: 'services',
          name: 'Servicios',
          type: 'folder',
          icon: ServicesIcon,
          description: 'Servicios de Digital Studio.',
          children: [
            {
              id: 'services-app',
              name: 'Servicios.exe',
              type: 'shortcut',
              icon: ServicesIcon,
              description: 'Abre la aplicación Servicios.',
              opens: 'services',
            },
            ...serviceNodes,
          ],
        },
        {
          id: 'projects',
          name: 'Proyectos',
          type: 'folder',
          icon: FolderIcon,
          description: 'Proyectos, imágenes, descripciones y enlaces. Contenido de marcador (DEMO) hasta añadir casos reales.',
          children: [
            {
              id: 'projects-app',
              name: 'Mis proyectos',
              type: 'shortcut',
              icon: FolderIcon,
              description: 'Abre la aplicación Mis proyectos.',
              opens: 'projects',
            },
            ...projectNodes,
          ],
        },
        {
          id: 'about',
          name: 'Nosotros',
          type: 'folder',
          icon: AboutIcon,
          description: 'Sobre Digital Studio: su filosofía y su enfoque tecnológico.',
          children: [
            {
              id: 'about-app',
              name: 'Nosotros.exe',
              type: 'shortcut',
              icon: AboutIcon,
              description: 'Abre la aplicación Nosotros.',
              opens: 'about',
            },
          ],
        },
        {
          id: 'contact',
          name: 'Contacto',
          type: 'folder',
          icon: MailIcon,
          description: 'Información de contacto y cómo solicitar un proyecto.',
          children: [
            {
              id: 'contact-app',
              name: 'Contacto.exe',
              type: 'shortcut',
              icon: MailIcon,
              description: 'Abre la aplicación Contacto.',
              opens: 'contact',
            },
          ],
        },
        {
          id: 'experiments',
          name: 'Experimentos',
          type: 'folder',
          icon: FlaskIcon,
          description: 'Demos, experimentos e innovaciones tecnológicas.',
          children: [
            {
              id: 'experiments-note',
              name: 'Pendiente.txt',
              type: 'file',
              icon: DocumentIcon,
              description: 'Marcador: todavía no hay experimentos publicados.',
              content:
                'PENDIENTE\n=========\n\nEsta carpeta está reservada para demos, experimentos e innovaciones tecnológicas.\n\nTodavía no hay experimentos publicados.\n',
            },
          ],
        },
        {
          id: 'readme',
          name: 'Readme.txt',
          type: 'file',
          icon: DocumentIcon,
          description: 'Presentación de Digital Studio y cómo explorar el sistema.',
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
