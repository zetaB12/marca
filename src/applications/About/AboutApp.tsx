import { UserIcon } from '../../components/PixelIcon/pixelIcons'
import { ABOUT_PROFILE } from '../../data/about'
import { useNavStore, type AboutTab } from '../../store/navStore'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './AboutApp.module.css'

const PROCESS = [
  ['Discovery', 'Conocemos tu negocio.'],
  ['Strategy', 'Definimos la solución.'],
  ['Design', 'Diseñamos la experiencia.'],
  ['Development', 'Construimos el proyecto.'],
  ['Launch', 'Publicamos y optimizamos.'],
  ['Growth', 'Medimos y mejoramos.'],
] as const

const TABS: { id: AboutTab; label: string }[] = [
  { id: 'behind', label: 'Behind N.' },
  { id: 'agency', label: 'Agency' },
  { id: 'process', label: 'Process' },
]

/** Información de la agencia. El contenido editorial definitivo llega en la Fase 3. */
export default function AboutApp() {
  const tab = useNavStore((s) => s.aboutTab)
  const setTab = useNavStore((s) => s.setAboutTab)

  return (
    <div className={shared.app}>
      <div role="tablist" aria-label="About sections" className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`about-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="about-panel"
            className={`${styles.tab} ${tab === t.id ? styles.selected : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="about-panel" role="tabpanel" aria-labelledby={`about-tab-${tab}`} className={`${shared.main} ${styles.panel}`}>
        {tab === 'behind' ? (
          <div className={styles.behind}>
            <div className={styles.photo}>
              {ABOUT_PROFILE.photo ? (
                <img src={ABOUT_PROFILE.photo} alt={ABOUT_PROFILE.name || 'Foto'} />
              ) : (
                <span className={styles.photoEmpty}>
                  <UserIcon size={48} />
                  <span>Tu foto aquí</span>
                </span>
              )}
            </div>
            <div className={styles.bio}>
              <h2 className={shared.heading}>{ABOUT_PROFILE.name || 'Behind N.'}</h2>
              {ABOUT_PROFILE.role && <p className={styles.role}>{ABOUT_PROFILE.role}</p>}
              {ABOUT_PROFILE.sections.map((section) => (
                <section key={section.id} className={styles.section}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  {section.body ? (
                    <p className={shared.text}>{section.body}</p>
                  ) : (
                    <p className={styles.pending}>
                      <span className={shared.demo}>Pendiente</span> Tu texto va aquí.
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        ) : tab === 'agency' ? (
          <>
            <h2 className={shared.heading}>Neal</h2>
            <p className={shared.text}>
              Creative Technology Agency en Trujillo, Perú. Un equipo enfocado en tecnología, diseño,
              automatización y crecimiento digital.
            </p>
            <p className={shared.text}>
              <span className={shared.demo}>Preliminary content</span> Filosofía, diferenciadores y
              equipo se completan en la siguiente fase.
            </p>
          </>
        ) : (
          <>
            <h2 className={shared.heading}>How we work</h2>
            <ol className={styles.steps}>
              {PROCESS.map(([name, text]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <Statusbar>
        <span>About Us.exe</span>
        <span>Trujillo, Perú</span>
      </Statusbar>
    </div>
  )
}
