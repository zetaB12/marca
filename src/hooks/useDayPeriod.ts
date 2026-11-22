import { useEffect, useState } from 'react'

export type DayPeriod = 'morning' | 'afternoon' | 'sunset' | 'night'

const TZ = 'America/Lima' // UTC−5 fijo (sin horario de verano)
/** Horas de inicio de cada período, en hora de Lima. */
const BOUNDARIES = [6, 12, 18, 20]

const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
})

/** Segundos transcurridos del día en Lima (no depende de la zona del dispositivo). */
function limaSeconds(d: Date) {
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, Number(x.value)]))
  return (p.hour % 24) * 3600 + p.minute * 60 + p.second
}

export function periodForHour(h: number): DayPeriod {
  if (h >= 6 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 20) return 'sunset'
  return 'night'
}

export function currentPeriod(d = new Date()): DayPeriod {
  return periodForHour(Math.floor(limaSeconds(d) / 3600))
}

/** Milisegundos hasta el próximo cambio de período. */
function msToNextBoundary(d = new Date()) {
  const sod = limaSeconds(d)
  const next = BOUNDARIES.map((h) => h * 3600).find((s) => s > sod) ?? 24 * 3600 + BOUNDARIES[0] * 3600
  return (next - sod) * 1000 - d.getMilliseconds() + 50
}

/** Período del día en Lima. Se reprograma solo al cruzar 06:00, 12:00, 18:00 y 20:00, y al volver a la pestaña. */
export function useDayPeriod(): DayPeriod {
  const [period, setPeriod] = useState<DayPeriod>(() => currentPeriod())

  useEffect(() => {
    let id: number
    const sync = () => {
      window.clearTimeout(id)
      setPeriod(currentPeriod())
      id = window.setTimeout(sync, msToNextBoundary())
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync()
    }
    id = window.setTimeout(sync, msToNextBoundary())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearTimeout(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return period
}
