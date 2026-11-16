import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { CloseGlyph, MaximizeGlyph, MinimizeGlyph, RestoreGlyph } from '../PixelIcon/pixelIcons'
import styles from './WindowFrame.module.css'

interface Props {
  title: string
  icon?: ReactNode
  children: ReactNode
  /** Cada botón solo se muestra si hay un handler real. */
  onMinimize?: () => void
  onToggleMaximize?: () => void
  onClose?: () => void
  maximized?: boolean
  active?: boolean
  className?: string
  labelId?: string
  /** Props de la barra de título (arrastre, doble clic). */
  titlebarProps?: HTMLAttributes<HTMLElement>
  ref?: Ref<HTMLElement>
}

export default function WindowFrame({
  title,
  children,
  onMinimize,
  onToggleMaximize,
  onClose,
  maximized = false,
  active = true,
  className,
  labelId,
  titlebarProps,
  ref,
}: Props) {
  return (
    <section
      ref={ref}
      className={`${styles.window} ${active ? '' : styles.inactive} ${className ?? ''}`}
      aria-labelledby={labelId}
    >
      <header className={styles.titlebar} {...titlebarProps}>
        <h2 className={styles.title} id={labelId}>
          {title}
        </h2>
        {onMinimize && (
          <button
            type="button"
            className={styles.ctrl}
            onClick={onMinimize}
            title="Minimizar"
            aria-label={`Minimizar ${title}`}
          >
            <MinimizeGlyph className={styles.minGlyph} />
          </button>
        )}
        {onToggleMaximize && (
          <button
            type="button"
            className={`${styles.ctrl} ${styles.maximize}`}
            onClick={onToggleMaximize}
            title={maximized ? 'Restaurar' : 'Maximizar'}
            aria-label={`${maximized ? 'Restaurar' : 'Maximizar'} ${title}`}
          >
            {maximized ? <RestoreGlyph /> : <MaximizeGlyph />}
          </button>
        )}
        {onClose && (
          <button
            type="button"
            className={`${styles.ctrl} ${styles.close}`}
            onClick={onClose}
            title="Cerrar"
            aria-label={`Cerrar ${title}`}
          >
            <CloseGlyph />
          </button>
        )}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
