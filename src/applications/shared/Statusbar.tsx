import type { ReactNode } from 'react'
import styles from './shared.module.css'

/** Barra de estado inferior de las aplicaciones (estilo Win9x). */
export default function Statusbar({ children }: { children: ReactNode }) {
  return <footer className={styles.statusbar}>{children}</footer>
}
