import WindowFrame from '../../components/WindowFrame/WindowFrame'
import styles from './SystemStatus.module.css'

export default function SystemStatus() {
  return (
    <WindowFrame title="System" className={styles.status} active={false}>
      <dl className={styles.list}>
        <div>
          <dt>SYSTEM STATUS:</dt>
          <dd>
            <span className={styles.dot} aria-hidden /> ONLINE
          </dd>
        </div>
        <div>
          <dt>VERSION:</dt>
          <dd>1.0.0</dd>
        </div>
      </dl>
    </WindowFrame>
  )
}
