/** Tecnologías con las que está construido este sitio. */
export interface StackItem {
  name: string
  role: string
}

export const STACK: StackItem[] = [
  { name: 'React', role: 'Interfaz de usuario' },
  { name: 'TypeScript', role: 'Tipado estricto' },
  { name: 'Vite', role: 'Compilación y servidor de desarrollo' },
  { name: 'Zustand', role: 'Estado global (ventanas y escritorio)' },
  { name: 'GSAP', role: 'Animaciones de entrada' },
  { name: 'Pixel art SVG', role: 'Iconografía propia (cuadrículas 16×16)' },
  { name: 'React Router', role: 'Navegación por URL' },
  { name: 'CSS Modules', role: 'Estilos con alcance local' },
]
