/** Lógica pura del buscaminas (sin React): tablero, primer clic seguro, expansión y victoria. */
export interface Level {
  id: string
  name: string
  rows: number
  cols: number
  mines: number
  /** Tamaño de ventana que deja ver el tablero completo. */
  win: { w: number; h: number }
}

export const LEVELS: Level[] = [
  { id: 'easy', name: 'Principiante', rows: 9, cols: 9, mines: 10, win: { w: 340, h: 500 } },
  { id: 'medium', name: 'Intermedio', rows: 16, cols: 16, mines: 40, win: { w: 480, h: 680 } },
]

export interface Cell {
  mine: boolean
  adj: number
  open: boolean
  flag: boolean
}

export type Status = 'ready' | 'playing' | 'won' | 'lost'

export interface Game {
  level: Level
  cells: Cell[]
  status: Status
  /** Índice de la mina que explotó. */
  boom: number | null
}

export const newGame = (level: Level): Game => ({
  level,
  cells: Array.from({ length: level.rows * level.cols }, () => ({ mine: false, adj: 0, open: false, flag: false })),
  status: 'ready',
  boom: null,
})

export function neighbors(level: Level, i: number): number[] {
  const r = Math.floor(i / level.cols)
  const c = i % level.cols
  const out: number[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols) out.push(nr * level.cols + nc)
    }
  }
  return out
}

/** Reparte las minas al primer clic, dejando libre esa casilla y las que la rodean. */
function plant(game: Game, safe: number): Game {
  const { level } = game
  const banned = new Set([safe, ...neighbors(level, safe)])
  const pool = game.cells.map((_, i) => i).filter((i) => !banned.has(i))
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }
  const cells = game.cells.map((c) => ({ ...c }))
  pool.slice(0, level.mines).forEach((i) => {
    cells[i].mine = true
  })
  cells.forEach((c, i) => {
    c.adj = neighbors(level, i).filter((n) => cells[n].mine).length
  })
  return { ...game, cells }
}

function reveal(game: Game, start: number): Game {
  const cells = game.cells.map((c) => ({ ...c }))
  const stack = [start]
  while (stack.length) {
    const i = stack.pop()!
    const cell = cells[i]
    if (cell.open || cell.flag) continue
    cell.open = true
    if (!cell.mine && cell.adj === 0) stack.push(...neighbors(game.level, i))
  }
  return { ...game, cells }
}

function settle(game: Game, hit: number | null): Game {
  if (hit !== null) {
    const cells = game.cells.map((c) => (c.mine && !c.flag ? { ...c, open: true } : c))
    return { ...game, cells, status: 'lost', boom: hit }
  }
  const won = game.cells.every((c) => c.mine || c.open)
  if (!won) return game
  return { ...game, status: 'won', cells: game.cells.map((c) => (c.mine ? { ...c, flag: true } : c)) }
}

export function openCell(game: Game, i: number): Game {
  if (game.status === 'won' || game.status === 'lost') return game
  let g = game
  if (g.status === 'ready') g = { ...plant(g, i), status: 'playing' }
  const cell = g.cells[i]
  if (cell.open || cell.flag) return g
  if (cell.mine) return settle(reveal(g, i), i)
  return settle(reveal(g, i), null)
}

export function toggleFlag(game: Game, i: number): Game {
  if (game.status === 'won' || game.status === 'lost') return game
  const cell = game.cells[i]
  if (cell.open) return game
  const cells = game.cells.map((c, k) => (k === i ? { ...c, flag: !c.flag } : c))
  return { ...game, cells }
}

/** Clic sobre un número ya abierto: abre las vecinas si las banderas coinciden con el número. */
export function chord(game: Game, i: number): Game {
  if (game.status !== 'playing') return game
  const cell = game.cells[i]
  if (!cell.open || cell.adj === 0) return game
  const around = neighbors(game.level, i)
  if (around.filter((n) => game.cells[n].flag).length !== cell.adj) return game
  let g = game
  let hit: number | null = null
  for (const n of around) {
    const c = g.cells[n]
    if (c.open || c.flag) continue
    if (c.mine) hit = n
    g = reveal(g, n)
  }
  return settle(g, hit)
}

export const flagsLeft = (game: Game) => game.level.mines - game.cells.filter((c) => c.flag).length
