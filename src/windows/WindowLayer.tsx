import { Suspense, useEffect, useRef } from 'react'
import { APP_COMPONENTS, prefetchApps } from '../applications/registry'
import { selectOpenWindows, useWindowStore } from '../store/windowStore'
import ManagedWindow from './ManagedWindow'
import styles from './WindowLayer.module.css'

/** Capa donde viven todas las ventanas; mide el área disponible para el WindowManager. */
export default function WindowLayer() {
  const ref = useRef<HTMLDivElement>(null)
  const windows = useWindowStore((s) => s.windows)
  const setBounds = useWindowStore((s) => s.setBounds)

  useEffect(() => prefetchApps(), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setBounds({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [setBounds])

  return (
    <div ref={ref} className={styles.layer}>
      {selectOpenWindows(windows).map((win) => {
        const App = APP_COMPONENTS[win.appId]
        return (
          <ManagedWindow key={win.id} win={win}>
            <Suspense fallback={null}>
              <App />
            </Suspense>
          </ManagedWindow>
        )
      })}
    </div>
  )
}
