/**
 * El preloader solo se muestra al entrar de nuevo (pestaña nueva, enlace o URL escrita).
 * En recargas y al volver con atrás/adelante el navegador reporta otro tipo de navegación
 * y se salta. No guarda nada en el navegador.
 */
export const SHOW_PRELOADER = (() => {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return !nav || nav.type === 'navigate'
})()
