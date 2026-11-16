import { useSettingsStore, type SettingsTab } from '../../store/settingsStore'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './SettingsApp.module.css'

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'display', label: 'Display' },
  { id: 'preferences', label: 'Preferences' },
]

/** Configuración real: las preferencias se aplican de inmediato y se recuerdan en el navegador. */
export default function SettingsApp() {
  const { tab, setTab, pattern, setPattern, animations, setAnimations, reset } = useSettingsStore()
  const dpr = window.devicePixelRatio || 1

  return (
    <div className={shared.app}>
      <div role="tablist" aria-label="Settings sections" className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`settings-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="settings-panel"
            className={`${styles.tab} ${tab === t.id ? styles.selected : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id="settings-panel"
        role="tabpanel"
        aria-labelledby={`settings-tab-${tab}`}
        className={`${shared.main} ${styles.panel}`}
      >
        {tab === 'display' ? (
          <>
            <label className={styles.option}>
              <input type="checkbox" checked={pattern} onChange={(e) => setPattern(e.target.checked)} />
              <span>Show desktop pattern</span>
            </label>
            <dl className={styles.info}>
              <div>
                <dt>Screen</dt>
                <dd>
                  {window.screen.width} × {window.screen.height}
                </dd>
              </div>
              <div>
                <dt>Pixel ratio</dt>
                <dd>{dpr}×</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <label className={styles.option}>
              <input
                type="checkbox"
                checked={animations}
                onChange={(e) => setAnimations(e.target.checked)}
              />
              <span>Enable animations</span>
            </label>
            <button type="button" className={styles.reset} onClick={reset}>
              Restore defaults
            </button>
          </>
        )}
      </div>
      <Statusbar>
        <span>Settings are saved in this browser</span>
      </Statusbar>
    </div>
  )
}
