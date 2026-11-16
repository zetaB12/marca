import { useEffect } from 'react'
import { useDesktopStore } from '../store/desktopStore'
import { useWindowStore } from '../store/windowStore'

/**
 * Atajos globales. Solo reacciona a teclas que no usan los formularios ni el navegador:
 * - Esc: cierra diálogo, menú contextual y menú Start (en ese orden).
 * - Alt+Tab / Alt+Shift+Tab: alterna ventanas (si el sistema operativo lo deja pasar).
 * - Ctrl+Alt+Supr/Retroceso/Fin: diálogo "Close Program".
 * - Enter con el foco en el escritorio: abre el icono seleccionado.
 */
export function useShortcuts() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing) return
      const desktop = useDesktopStore.getState()

      if (e.key === 'Escape') {
        if (desktop.dialog) desktop.closeDialog()
        else if (desktop.contextMenu) desktop.closeContextMenu()
        else if (desktop.startOpen) desktop.closeStart()
        return
      }

      if (desktop.dialog) return // un diálogo modal no deja pasar el resto de atajos

      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        useWindowStore.getState().cycleWindow(e.shiftKey ? -1 : 1)
        return
      }

      if (e.ctrlKey && e.altKey && ['Delete', 'Backspace', 'End'].includes(e.key)) {
        e.preventDefault()
        desktop.openDialog('security')
        return
      }

      if (e.key === 'Enter' && e.target === document.body && desktop.selectedIcon) {
        desktop.launch(desktop.selectedIcon)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
