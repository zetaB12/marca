/**
 * Presentación personal ("Behind N."). Rellena este archivo con tu información real:
 * - `photo`: ruta a una imagen dentro de /public (por ejemplo '/image/foto.jpg').
 * - `name` y `role`: cómo quieres presentarte.
 * - `body` de cada sección: tu texto. Mientras esté vacío se muestra un marcador "Pendiente".
 */
export interface AboutSection {
  id: string
  title: string
  body: string
}

export const ABOUT_PROFILE: {
  name: string
  role: string
  photo: string | null
  sections: AboutSection[]
} = {
  name: 'Deyvi Neal',
  role: 'Founder / Digital Creator',
  photo: '/image/profile-98.webp',
  sections: [
    { id: 'who', title: 'Quién soy', body: 'Soy Deyvi Neal. Creo, diseño y desarrollo soluciones digitales que conectan tecnología con ideas.' },
    { id: 'experience', title: 'Mi experiencia en desarrollo y tecnología', body: 'De la curiosidad por la tecnología a crear soluciones digitales que convierten ideas en realidad.' },
    { id: 'why', title: 'Por qué creé Digital Studio', body: 'Creé Digital Studio para llevar mis ideas y conocimientos más allá, ayudando a negocios a aprovechar la tecnología y convertir sus ideas en proyectos digitales.' },
  ],
}
