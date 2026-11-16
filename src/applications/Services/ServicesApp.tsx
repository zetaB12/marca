import { SERVICES } from '../../data/services'
import { useNavStore } from '../../store/navStore'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './ServicesApp.module.css'

/** Catálogo provisional de servicios; el detalle por servicio llega en la Fase 3. */
export default function ServicesApp() {
  const selectedId = useNavStore((s) => s.serviceId)
  const setSelectedId = useNavStore((s) => s.selectService)
  const selected = SERVICES.find((s) => s.id === selectedId) ?? SERVICES[0]

  return (
    <div className={shared.app}>
      <div className={styles.layout}>
        <ul className={styles.grid} aria-label="Servicios">
          {SERVICES.map((s) => {
            const Icon = s.icon
            const active = s.id === selected.id
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`${styles.item} ${active ? styles.active : ''}`}
                  aria-pressed={active}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span className={styles.glyph}>
                    <Icon size={32} />
                  </span>
                  <span className={styles.label}>{s.name}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <section className={styles.detail} aria-live="polite">
          <h2 className={shared.heading}>{selected.name}</h2>
          <p className={shared.text}>{selected.description}</p>
          <span className={shared.demo}>Catálogo preliminar</span>
        </section>
      </div>
      <Statusbar>
        <span>{SERVICES.length} elemento(s)</span>
        <span>{selected.name}</span>
      </Statusbar>
    </div>
  )
}
