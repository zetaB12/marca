import { useDesktopStore } from '../../store/desktopStore'
import SecurityDialog from './SecurityDialog'
import ShutdownDialog from './ShutdownDialog'

export default function DialogHost() {
  const dialog = useDesktopStore((s) => s.dialog)
  if (dialog === 'shutdown') return <ShutdownDialog />
  if (dialog === 'security') return <SecurityDialog />
  return null
}
