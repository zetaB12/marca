import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import WindowFrame from '../WindowFrame/WindowFrame'
import styles from './SystemDialog.module.css'

interface Props {
  title: string
  icon?: ReactNode
  onClose: () => void
  children: ReactNode
}

/** Diálogo modal estilo Win9x: bloquea el fondo, atrapa el foco y lo devuelve al cerrar. */
export default function SystemDialog({ title, icon, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('[data-autofocus], button, input')?.focus()
    return () => previous?.focus?.()
  }, [])

  const trapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const focusable = [...(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, [tabindex="0"]') ?? [])]
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      last.focus()
      e.preventDefault()
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus()
      e.preventDefault()
    }
  }

  return (
    <div className={styles.backdrop}>
      <div
        ref={ref}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-dialog-title"
        onKeyDown={trapTab}
      >
        <WindowFrame title={title} icon={icon} labelId="system-dialog-title" onClose={onClose}>
          {children}
        </WindowFrame>
      </div>
    </div>
  )
}
