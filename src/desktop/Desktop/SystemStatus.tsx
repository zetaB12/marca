import WindowFrame from "../../components/WindowFrame/WindowFrame";
import styles from "./SystemStatus.module.css";

export default function SystemStatus() {
  return (
    <WindowFrame title="Sistema" className={styles.status} active={false}>
      <dl className={styles.list}>
        <div>
          <dt>ESTADO:</dt>
          <dd>
            <span className={styles.dot} aria-hidden /> EN LÍNEA
          </dd>
        </div>
        <div>
          <dt>VERSIÓN:</dt>
          <dd>1.0.1</dd>
        </div>
      </dl>
    </WindowFrame>
  );
}
