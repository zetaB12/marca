/**
 * Datos de DEMOSTRACIÓN. No son proyectos ni clientes reales.
 * Para agregar un proyecto real, añade un objeto con `demo: false` (y `image` con la captura en /public/image).
 */
export interface ProjectCategory {
  id: string
  name: string
}

export interface Project {
  id: string
  categoryId: string
  name: string
  /** Segunda línea de la tarjeta: rubro · servicio. */
  subtitle: string
  description: string
  tech: string[]
  demo: boolean
  /** Captura del proyecto (ruta en /public). Sin imagen se muestra un marcador de color. */
  image?: string
  /** Color del marcador cuando no hay imagen. */
  tone: string
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'web', name: 'Web' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'sistemas', name: 'Sistemas' },
  { id: 'branding', name: 'Branding' },
]

const DEMO_TEXT = 'Proyecto de demostración. Será reemplazado por un caso real.'

export const PROJECTS: Project[] = [
  { id: 'demo-clinic', categoryId: 'web', name: 'Clínica estética', subtitle: 'Medicina Estética · Web & Marketing', description: DEMO_TEXT, tech: ['React', 'SEO'], demo: true, tone: '#b99a86' },
  { id: 'demo-realestate', categoryId: 'web', name: 'Portal inmobiliario', subtitle: 'Inmobiliaria · Web & Gestión', description: DEMO_TEXT, tech: ['React', 'Mapas'], demo: true, tone: '#3b5a8f' },
  { id: 'demo-webapp', categoryId: 'sistemas', name: 'Panel de negocio', subtitle: 'Software · Plataforma Web', description: DEMO_TEXT, tech: ['React', 'TypeScript'], demo: true, tone: '#1b2140' },
  { id: 'demo-store', categoryId: 'ecommerce', name: 'Tienda online', subtitle: 'Retail · E-commerce', description: DEMO_TEXT, tech: ['React', 'Pagos'], demo: true, tone: '#c9a24a' },
  { id: 'demo-corporate', categoryId: 'web', name: 'Sitio corporativo', subtitle: 'Empresa · Web Institucional', description: DEMO_TEXT, tech: ['React', 'TypeScript'], demo: true, tone: '#5b7a6a' },
  { id: 'demo-brand', categoryId: 'branding', name: 'Identidad de marca', subtitle: 'Startup · Branding', description: DEMO_TEXT, tech: ['Diseño', 'Logotipo'], demo: true, tone: '#7a5fb0' },
]
