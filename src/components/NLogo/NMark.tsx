import type { IconProps } from '../PixelIcon/pixelIcons'

/**
 * Marca "N." sobre cuadro azul: es el favicon y el icono de la ventana Home.
 * Glifos de W95FA (SIL OFL 1.1, Alina Sava) convertidos a trazos.
 */
export default function NMark({ size = 16, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="-10 -30 780 780"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="-10" y="-30" width="780" height="780" fill="#243b5a" />
      <path fill="#fff" d="M290 400L290 240L210 240L210 400M130 80L130 0L50 0L50 720L130 720L130 240L210 240L210 80M450 0L450 480L370 480L370 640L450 640L450 720L530 720L530 0M370 480L370 400L290 400L290 480" />
      <path fill="#fff" d="M130 720L130 640L50 640L50 720" transform="translate(580 0)" />
    </svg>
  )
}
