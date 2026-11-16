import {
  AIIcon,
  AutomationIcon,
  CartIcon,
  MegaphoneIcon,
  SearchIcon,
  ServicesIcon,
  WebIcon,
  type IconComponent,
} from '../components/PixelIcon/pixelIcons'

export interface Service {
  id: string
  name: string
  description: string
  icon: IconComponent
}

/** Servicios. Los cinco primeros se presentan en Welcome.exe, que reutiliza estas descripciones. */
export const SERVICES: Service[] = [
  {
    id: 'web',
    name: 'DESARROLLO WEB',
    description: 'Diseño y desarrollo de páginas web profesionales para negocios.',
    icon: WebIcon,
  },
  {
    id: 'ecommerce',
    name: 'E-COMMERCE',
    description: 'Creo tiendas online y soluciones para vender por Internet.',
    icon: CartIcon,
  },
  {
    id: 'software',
    name: 'SOFTWARE Y SISTEMAS',
    description: 'Desarrollo aplicaciones y sistemas adaptados a las necesidades de cada negocio.',
    icon: ServicesIcon,
  },
  {
    id: 'automation',
    name: 'AUTOMATIZACIÓN',
    description: 'Automatizo procesos, integro herramientas y optimizo tareas empresariales.',
    icon: AutomationIcon,
  },
  {
    id: 'ai',
    name: 'INTELIGENCIA ARTIFICIAL',
    description: 'Integro inteligencia artificial para crear soluciones más inteligentes.',
    icon: AIIcon,
  },
  {
    id: 'marketing',
    name: 'MARKETING DIGITAL',
    description:
      'Estrategias de marketing, publicidad digital, generación de leads y optimización de conversiones.',
    icon: MegaphoneIcon,
  },
  {
    id: 'seo',
    name: 'SEO Y GEO',
    description:
      'Posicionamiento orgánico, SEO técnico y optimización para motores de búsqueda y experiencias de búsqueda con IA.',
    icon: SearchIcon,
  },
]
