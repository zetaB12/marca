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
  name: '',
  role: '',
  photo: null,
  sections: [
    { id: 'who', title: 'Quién soy', body: '' },
    { id: 'experience', title: 'Mi experiencia en desarrollo y tecnología', body: '' },
    { id: 'vision', title: 'Mi visión sobre la transformación digital', body: '' },
    { id: 'why', title: 'Por qué creé N. Digital Studio', body: '' },
  ],
}
