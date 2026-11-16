/**
 * Factor de escala de la interfaz según el ancho útil de la pantalla (en px CSS).
 * Hasta 1440 px es 1 (laptops); crece de forma proporcional hasta 1,6 (monitores de 24"–27").
 * Se aplica al texto, a las ventanas por defecto y a la barra de tareas.
 */
export const BASE_WIDTH = 1440
export const MAX_SCALE = 1.6

export function uiScale(width: number) {
  return Math.min(MAX_SCALE, Math.max(1, width / BASE_WIDTH))
}
