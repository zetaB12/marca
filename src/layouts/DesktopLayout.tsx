import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import ContextMenu from '../desktop/ContextMenu/ContextMenu'
import Desktop from '../desktop/Desktop/Desktop'
import DialogHost from '../desktop/Dialogs/DialogHost'
import Niko from '../components/Niko/Niko'
import Taskbar from '../desktop/Taskbar/Taskbar'
import { useApplySettings } from '../hooks/useApplySettings'
import { useShortcuts } from '../hooks/useShortcuts'
import { WELCOME_DELAY_MS, useDesktopStore } from '../store/desktopStore'
import { useWindowStore } from '../store/windowStore'
import WindowLayer from '../windows/WindowLayer'

export default function DesktopLayout() {
  const booted = useDesktopStore((s) => s.booted)
  const openWindow = useWindowStore((s) => s.openWindow)

  useShortcuts()
  useApplySettings()

  // Como en Windows 98: primero se ve el escritorio y, un momento después, se abre la bienvenida.
  useEffect(() => {
    if (!booted) return
    const id = window.setTimeout(() => openWindow('home'), WELCOME_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [booted, openWindow])

  return (
    <>
      <Desktop />
      {booted && <Niko />}
      <Outlet />
      <WindowLayer />
      <ContextMenu />
      <Taskbar />
      <DialogHost />
    </>
  )
}
