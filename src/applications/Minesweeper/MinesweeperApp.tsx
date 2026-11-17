import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { FaceHappyIcon, FaceLostIcon, FaceWinIcon, FaceWowIcon } from '../../components/PixelIcon/pixelIcons'
import { useWindowStore } from '../../store/windowStore'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import { LEVELS, chord, flagsLeft, newGame, openCell, toggleFlag, type Game, type Level } from './game'
import styles from './MinesweeperApp.module.css'

const COLORS = ['', '#0000ff', '#007b00', '#ff0000', '#00007b', '#7b0000', '#007b7b', '#000000', '#7b7b7b']
const LONG_PRESS_MS = 400

const led = (n: number) => {
  const v = Math.max(-99, Math.min(999, n))
  return v < 0 ? '-' + String(-v).padStart(2, '0') : String(v).padStart(3, '0')
}

function Flag() {
  return (
    <svg viewBox="0 0 8 8" width="14" height="14" shapeRendering="crispEdges" aria-hidden>
      <path fill="#ff0000" d="M2 0h4v1H2zM2 1h4v2H2z" />
      <path fill="#000" d="M3 3h1v3H3zM1 6h5v1H1zM2 5h3v1H2z" />
    </svg>
  )
}

function Mine() {
  return (
    <svg viewBox="0 0 9 9" width="14" height="14" shapeRendering="crispEdges" aria-hidden>
      <path fill="#000" d="M4 0h1v9H4zM0 4h9v1H0zM2 2h5v5H2zM1 1h1v1H1zM7 1h1v1H7zM1 7h1v1H1zM7 7h1v1H7z" />
      <path fill="#fff" d="M3 3h1v1H3z" />
    </svg>
  )
}

export default function MinesweeperApp() {
  const [game, setGame] = useState<Game>(() => newGame(LEVELS[0]))
  const [seconds, setSeconds] = useState(0)
  const [flagMode, setFlagMode] = useState(false)
  const [pressing, setPressing] = useState(false)
  // Pulsación larga en táctil = bandera; `fired` evita que el clic posterior abra la casilla.
  const press = useRef<{ timer: number; fired: boolean } | null>(null)

  useEffect(() => {
    if (game.status !== 'playing') return
    const id = window.setInterval(() => setSeconds((s) => Math.min(999, s + 1)), 1000)
    return () => window.clearInterval(id)
  }, [game.status])

  const restart = (level: Level = game.level) => {
    setGame(newGame(level))
    setSeconds(0)
    if (level.id === game.level.id) return
    // Al cambiar de nivel la ventana se ajusta al tablero (sin salirse de la pantalla).
    const { windows, bounds, resizeWindow } = useWindowStore.getState()
    const win = windows.minesweeper
    if (!win?.isOpen) return
    const w = Math.min(level.win.w, bounds.w)
    const h = Math.min(level.win.h, bounds.h)
    resizeWindow('minesweeper', level.win, {
      x: Math.max(0, Math.min(win.position.x, bounds.w - w)),
      y: Math.max(0, Math.min(win.position.y, bounds.h - h)),
    })
  }

  const onCell = (i: number) => {
    if (press.current?.fired) {
      press.current = null
      return
    }
    setGame((g) => {
      if (g.cells[i].open) return chord(g, i)
      return flagMode ? toggleFlag(g, i) : openCell(g, i)
    })
  }

  const onContext = (e: MouseEvent, i: number) => {
    e.preventDefault()
    e.stopPropagation()
    setGame((g) => toggleFlag(g, i))
  }

  const Face =
    game.status === 'won' ? FaceWinIcon : game.status === 'lost' ? FaceLostIcon : pressing ? FaceWowIcon : FaceHappyIcon
  const over = game.status === 'won' || game.status === 'lost'
  const { rows, cols } = game.level

  return (
    <div className={shared.app}>
      <div className={styles.levels} role="radiogroup" aria-label="Dificultad">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={game.level.id === l.id}
            className={`${styles.level} ${game.level.id === l.id ? styles.on : ''}`}
            onClick={() => restart(l)}
          >
            {l.name}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={flagMode}
          className={`${styles.level} ${styles.flagBtn} ${flagMode ? styles.on : ''}`}
          onClick={() => setFlagMode((v) => !v)}
          title="Modo bandera (para pantallas táctiles)"
        >
          Bandera
        </button>
      </div>

      <div className={`${shared.main} ${styles.stage}`}>
        <div className={styles.frame}>
          <div className={styles.head}>
            <span className={styles.led} aria-label={`Minas restantes: ${flagsLeft(game)}`}>
              {led(flagsLeft(game))}
            </span>
            <button type="button" className={styles.face} onClick={() => restart()} aria-label="Nueva partida">
              <Face size={32} />
            </button>
            <span className={styles.led} aria-label={`Tiempo: ${seconds} s`}>
              {led(seconds)}
            </span>
          </div>

          <div
            className={styles.board}
            style={{ '--cols': cols, '--rows': rows } as CSSProperties}
            role="grid"
            aria-label="Tablero"
            onPointerDown={(e) => e.button === 0 && setPressing(true)}
            onPointerUp={() => setPressing(false)}
            onPointerLeave={() => setPressing(false)}
          >
            {game.cells.map((c, i) => {
              const wrongFlag = game.status === 'lost' && c.flag && !c.mine
              return (
                <button
                  key={i}
                  type="button"
                  role="gridcell"
                  className={`${styles.cell} ${c.open ? styles.open : ''} ${game.boom === i ? styles.boom : ''}`}
                  disabled={over && !c.open && !c.flag}
                  aria-label={c.open ? (c.mine ? 'mina' : `${c.adj}`) : c.flag ? 'bandera' : 'cerrada'}
                  onClick={() => onCell(i)}
                  onContextMenu={(e) => onContext(e, i)}
                  onPointerDown={(e) => {
                    if (e.pointerType !== 'touch' || c.open) return
                    const timer = window.setTimeout(() => {
                      if (press.current) press.current.fired = true
                      setGame((g) => toggleFlag(g, i))
                    }, LONG_PRESS_MS)
                    press.current = { timer, fired: false }
                  }}
                  onPointerUp={() => press.current && window.clearTimeout(press.current.timer)}
                  onPointerLeave={() => press.current && window.clearTimeout(press.current.timer)}
                  style={c.open && c.adj ? { color: COLORS[c.adj] } : undefined}
                >
                  {c.open ? (c.mine ? <Mine /> : c.adj || '') : wrongFlag ? <Mine /> : c.flag ? <Flag /> : ''}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <Statusbar>
        <span>
          {game.status === 'won' ? '¡Ganaste!' : game.status === 'lost' ? 'Boom. Intenta de nuevo' : 'Clic derecho: bandera'}
        </span>
        <span>
          {cols}×{rows} · {game.level.mines} minas
        </span>
      </Statusbar>
    </div>
  )
}
