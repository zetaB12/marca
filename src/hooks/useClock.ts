import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let id: number
    const tick = () => {
      setNow(new Date())
      id = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    }
    id = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    return () => window.clearTimeout(id)
  }, [])
  return { text: fmt.format(now), iso: now.toISOString() }
}
