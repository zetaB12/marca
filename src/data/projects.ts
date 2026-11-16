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
  { id: 'corporate', name: 'Corporate Websites' },
  { id: 'clinics', name: 'Medical & Aesthetic Clinics' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'realestate', name: 'Real Estate' },
  { id: 'landing', name: 'Landing Pages' },
  { id: 'webapps', name: 'Web Applications' },
]

export const PROJECTS: Project[] = [
  {
    id: 'demo-corporate',
    categoryId: 'corporate',
    name: 'Corporate Site (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'TypeScript'],
    demo: true,
  },
  {
    id: 'demo-clinic',
    categoryId: 'clinics',
    name: 'Clinic Website (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'SEO'],
    demo: true,
  },
  {
    id: 'demo-store',
    categoryId: 'ecommerce',
    name: 'Online Store (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'Payments'],
    demo: true,
  },
  {
    id: 'demo-realestate',
    categoryId: 'realestate',
    name: 'Property Portal (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'Maps'],
    demo: true,
  },
  {
    id: 'demo-landing',
    categoryId: 'landing',
    name: 'Campaign Landing (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'Analytics'],
    demo: true,
  },
  {
    id: 'demo-webapp',
    categoryId: 'webapps',
    name: 'Business Dashboard (DEMO)',
    description: 'Proyecto de demostración. Será reemplazado por un caso real.',
    tech: ['React', 'TypeScript'],
    demo: true,
  },
]
