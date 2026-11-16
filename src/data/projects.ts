/**
 * Datos de DEMOSTRACIÓN. No son proyectos ni clientes reales.
 * Para agregar un proyecto real, añade un objeto con `demo: false`.
 */
export interface ProjectCategory {
  id: string
  name: string
}

export interface Project {
  id: string
  categoryId: string
  name: string
  description: string
  tech: string[]
  demo: boolean
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'corporate', name: 'Sitios corporativos' },
  { id: 'clinics', name: 'Clínicas médicas y estéticas' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'realestate', name: 'Inmobiliarias' },
  { id: 'landing', name: 'Landing pages' },
  { id: 'webapps', name: 'Aplicaciones web' },
]

export const PROJECTS: Project[] = [
  {
    id: 'demo-corporate',
    categoryId: 'corporate',
    name: 'Sitio corporativo (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'TypeScript'],
    demo: true,
  },
  {
    id: 'demo-clinic',
    categoryId: 'clinics',
    name: 'Sitio de clínica (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'SEO'],
    demo: true,
  },
  {
    id: 'demo-store',
    categoryId: 'ecommerce',
    name: 'Tienda online (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'Pagos'],
    demo: true,
  },
  {
    id: 'demo-realestate',
    categoryId: 'realestate',
    name: 'Portal inmobiliario (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'Mapas'],
    demo: true,
  },
  {
    id: 'demo-landing',
    categoryId: 'landing',
    name: 'Landing de campaña (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'Analítica'],
    demo: true,
  },
  {
    id: 'demo-webapp',
    categoryId: 'webapps',
    name: 'Panel de negocio (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'TypeScript'],
    demo: true,
  },
]
