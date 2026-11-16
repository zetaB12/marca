import { ComputerIcon } from '../../components/PixelIcon/pixelIcons'
import { STACK } from '../../data/stack'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './SystemPropertiesApp.module.css'

/** Propiedades del sistema: tecnologías con las que está construido este sitio. */
export default function SystemPropertiesApp() {
  return (
    <div className={shared.app}>
      <div className={`${shared.main} ${styles.body}`}>
        <div className={styles.head}>
          <ComputerIcon size={48} />
          <div>
            <h2 className={shared.heading}>Sistema</h2>
            <p className={shared.text}>Neal OS 1.0.0 — tecnologías y herramientas en uso.</p>
          </div>
        </div>
        <dl className={styles.list}>
          {STACK.map((item) => (
            <div key={item.name} className={styles.row}>
              <dt>{item.name}</dt>
              <dd>{item.role}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Statusbar>
        <span>{STACK.length} tecnologías</span>
        <span>Versión 1.0.0</span>
      </Statusbar>
    </div>
  )
}
