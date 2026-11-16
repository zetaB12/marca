import { CH, FRAMES, FRAME_COUNT, W, toPath } from './hourglassSprite'
import styles from './Hourglass.module.css'

interface Props {
  /** Se llama al completar cada ciclo (caída de arena + giro). */
  onCycle?: () => void
}

/** Reloj de arena pixel art animado con una tira de frames y `steps()` (sin JS por frame). */
export default function Hourglass({ onCycle }: Props) {
  return (
    <div className={styles.viewport} aria-hidden>
      <svg
        className={styles.strip}
        viewBox={`0 0 ${W * FRAME_COUNT} ${CH}`}
        onAnimationIteration={onCycle}
        shapeRendering="crispEdges"
      >
        {FRAMES.map((cells, i) => (
          <g key={i}>
            <path className={styles.glass} d={toPath(cells, 'g', i * W)} />
            <path className={styles.sand} d={toPath(cells, 's', i * W)} />
          </g>
        ))}
      </svg>
    </div>
  )
}
