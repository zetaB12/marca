/**
 * Sprite del reloj de arena (estilo cursor de Windows 98), generado por cuadrícula.
 * El reloj base mide 11×16; cada frame vive en un lienzo de 21×20 para poder girarlo.
 * Frames: arena cayendo (0..8) y giro de 180° en pasos de 30° (9..13); el siguiente
 * paso del giro equivale al frame 0, así que el ciclo se repite sin salto.
 */
const BW = 11
const H = 16
export const W = 21 // ancho del lienzo
export const CH = 20 // alto del lienzo
const OX = 5 // desplazamiento del reloj dentro del lienzo
const OY = 2
const K = 8 // pasos de caída de arena

export type Kind = 'g' | 's' // glass (contorno) | sand (arena)
export type Cell = readonly [x: number, y: number, kind: Kind]

// Semiancho interior de la cámara en cada fila y = 1..14 (simétrico respecto al cuello).
const HALF = [4, 3, 3, 2, 2, 1, 0, 0, 1, 2, 2, 3, 3, 4]
const CX = 5

function glassCells(): Cell[] {
  const cells: Cell[] = []
  for (let x = 0; x < BW; x++) {
    cells.push([x, 0, 'g'], [x, H - 1, 'g'])
  }
  HALF.forEach((h, i) => {
    const y = i + 1
    cells.push([CX - h - 1, y, 'g'], [CX + h + 1, y, 'g'])
  })
  return cells
}

function chamber(fromY: number, toY: number): [number, number][] {
  const out: [number, number][] = []
  for (let y = toY; y >= fromY; y--) {
    const h = HALF[y - 1]
    for (let x = CX - h; x <= CX + h; x++) out.push([x, y])
  }
  return out // de abajo hacia arriba
}

const TOP = chamber(1, 6)
const BOTTOM = chamber(9, 14)

function sandFrame(k: number): Cell[] {
  const topRemain = Math.round((TOP.length * (K - k)) / K)
  const bottomFill = Math.round((BOTTOM.length * k) / K)
  const sand: Cell[] = [
    ...TOP.slice(0, topRemain).map(([x, y]): Cell => [x, y, 's']),
    ...BOTTOM.slice(0, bottomFill).map(([x, y]): Cell => [x, y, 's']),
  ]
  if (k > 0 && k < K) {
    const surface = bottomFill ? Math.min(...BOTTOM.slice(0, bottomFill).map(([, y]) => y)) : H - 1
    for (let y = 7; y < surface; y++) sand.push([CX, y, 's'])
  }
  return [...glassCells(), ...sand]
}

const fall = Array.from({ length: K + 1 }, (_, k) => sandFrame(k))

/** Coloca el reloj base en el lienzo sin girarlo. */
const place = (cells: Cell[]): Cell[] => cells.map(([x, y, k]) => [x + OX, y + OY, k])

/** Gira el reloj base `deg` grados (sentido horario) con muestreo por vecino más cercano. */
function rotate(cells: Cell[], deg: number): Cell[] {
  const src = new Map<string, Kind>()
  for (const [x, y, k] of cells) src.set(`${x},${y}`, k)
  const rad = (deg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const out: Cell[] = []
  for (let cy = 0; cy < CH; cy++) {
    for (let cx = 0; cx < W; cx++) {
      let glass = 0
      let sand = 0
      // 2×2 submuestras por celda para no perder líneas de 1 píxel al girar
      for (const [dx, dy] of [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]) {
        const rx = cx + dx - W / 2
        const ry = cy + dy - CH / 2
        const sx = Math.floor(rx * cos + ry * sin + BW / 2)
        const sy = Math.floor(-rx * sin + ry * cos + H / 2)
        const kind = src.get(`${sx},${sy}`)
        if (kind === 'g') glass++
        else if (kind === 's') sand++
      }
      if (glass >= 2) out.push([cx, cy, 'g'])
      else if (sand >= 2) out.push([cx, cy, 's'])
    }
  }
  return out
}

export const FRAMES: Cell[][] = [
  ...fall.map(place),
  ...[30, 60, 90, 120, 150].map((deg) => rotate(fall[K], deg)),
]

export const FRAME_COUNT = FRAMES.length
export const FRAME_PREVIEW = 4

export function toPath(cells: Cell[], kind: Kind, offsetX = 0, scale = 1) {
  return cells
    .filter(([, , k]) => k === kind)
    .map(([x, y]) => `M${(x + offsetX) * scale} ${y * scale}h${scale}v${scale}h-${scale}z`)
    .join('')
}

/** Cursor de reloj de arena (SVG 22×32) para usar con `cursor: url(...)`. */
export const HOURGLASS_CURSOR = (() => {
  const cells = fall[FRAME_PREVIEW]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BW * 2}" height="${H * 2}" shape-rendering="crispEdges">` +
    `<path fill="#fff" d="${toPath(cells, 'g', 0, 2)}"/>` +
    `<path fill="#b99a70" d="${toPath(cells, 's', 0, 2)}"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})()
