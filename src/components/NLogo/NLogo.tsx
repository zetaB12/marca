import styles from './NLogo.module.css'

interface Props {
  /** Alto del logo en px. */
  size?: number
  /** "light" para fondos oscuros. */
  tone?: 'dark' | 'light'
  className?: string
}

/**
 * Wordmark "NEAL." — glifos reales de W95FA (SIL OFL 1.1, Alina Sava) convertidos a trazos,
 * para no depender de la carga de la fuente. Letras en azul y punto en el color de acento.
 */
export default function NLogo({ size = 64, tone = 'dark', className }: Props) {
  return (
    <svg
      className={`${styles.logo} ${tone === 'light' ? styles.light : ''} ${className ?? ''}`}
      height={size}
      width={(size * 2320) / 720}
      viewBox="50 0 2320 720"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Neal"
    >
      <g fill="currentColor">
        <path transform="translate(0 0)" d="M290 400L290 240L210 240L210 400M130 80L130 0L50 0L50 720L130 720L130 240L210 240L210 80M450 0L450 480L370 480L370 640L450 640L450 720L530 720L530 0M370 480L370 400L290 400L290 480" />
        <path transform="translate(580 0)" d="M450 80L450 0L50 0L50 720L450 720L450 640L130 640L130 400L370 400L370 320L130 320L130 80" />
        <path transform="translate(1080 0)" d="M370 160L370 0L290 0L290 160M610 720L610 560L530 560L530 720M450 320L450 160L370 160L370 320M130 720L130 560L50 560L50 720M450 320L450 480L210 480L210 320L130 320L130 560L530 560L530 320M290 320L290 160L210 160L210 320" />
        <path transform="translate(1740 0)" d="M130 640L130 0L50 0L50 720L450 720L450 640" />
      </g>
      <path className={styles.dot} transform="translate(2240 0)" d="M130 720L130 640L50 640L50 720" />
    </svg>
  )
}
