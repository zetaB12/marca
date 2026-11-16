/** Contenido de la papelera (humor de la experiencia). Son datos ficticios. */
export interface BinItem {
  id: string
  name: string
  kind: 'folder' | 'file'
  type: string
  origin: string
  deleted: string
  size: string
  /** Mensaje al abrir el elemento. */
  message: string
  /** Si existe, el elemento no se puede restaurar y se muestra este error. */
  restoreError?: string
}

export const BIN_ITEMS: BinItem[] = [
  {
    id: 'ex',
    name: 'fotos de mi ex',
    kind: 'folder',
    type: 'Carpeta de archivos',
    origin: 'C:\\Mis Documentos\\Privado',
    deleted: '14/02/2020',
    size: '',
    message: 'No se puede abrir la carpeta. Es por tu propio bien.',
    restoreError:
      'No se puede restaurar "fotos de mi ex". La ubicación original ya no existe. Mejor así.',
  },
  {
    id: 'ideas',
    name: 'ideas geniales a las 3 a.m.',
    kind: 'folder',
    type: 'Carpeta de archivos',
    origin: 'C:\\Mis Documentos\\Ideas',
    deleted: '02/03/2021',
    size: '',
    message: 'Contiene 47 ideas geniales. Ninguna sobrevivió a la mañana.',
  },
  {
    id: 'excusas',
    name: 'excusas para llegar tarde',
    kind: 'folder',
    type: 'Carpeta de archivos',
    origin: 'C:\\Trabajo',
    deleted: '08/11/2022',
    size: '',
    message: 'Carpeta vacía. Esta vez era verdad: había mucho tráfico.',
  },
  {
    id: 'pass',
    name: 'contraseña123.txt',
    kind: 'file',
    type: 'Documento de texto',
    origin: 'C:\\Mis Documentos',
    deleted: '21/06/2019',
    size: '1 KB',
    message: 'Contraseña: 123. Sí, es la misma que usas para todo.',
  },
  {
    id: 'final',
    name: 'Proyecto_final_v7_FINAL_de_verdad.doc',
    kind: 'file',
    type: 'Documento de Word',
    origin: 'C:\\Escritorio',
    deleted: '30/11/2018',
    size: '2,4 MB',
    message: 'Versión 7 de 7. Probablemente.',
  },
  {
    id: 'lunes',
    name: 'planes_para_el_lunes.txt',
    kind: 'file',
    type: 'Documento de texto',
    origin: 'C:\\Escritorio',
    deleted: '05/01/2020',
    size: '1 KB',
    message: 'Plan: empezar el martes.',
  },
  {
    id: 'logo',
    name: 'copia_de_copia_de_logo.png',
    kind: 'file',
    type: 'Imagen PNG',
    origin: 'C:\\Diseño',
    deleted: '17/09/2021',
    size: '312 KB',
    message: 'Esta imagen ya no se parece a ningún logo conocido.',
  },
  {
    id: 'dieta',
    name: 'dieta_desde_mañana.xls',
    kind: 'file',
    type: 'Hoja de cálculo de Excel',
    origin: 'C:\\Mis Documentos',
    deleted: '01/01/2023',
    size: '18 KB',
    message: 'Última modificación: 1 de enero. Cada año.',
  },
]
