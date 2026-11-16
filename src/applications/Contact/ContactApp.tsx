import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './ContactApp.module.css'

/** Ventana de contacto provisional; el formulario definitivo llega en la Fase 4. */
export default function ContactApp() {
  return (
    <div className={shared.app}>
      <div className={`${shared.main} ${styles.body}`}>
        <h2 className={shared.heading}>Ready to start your next project?</h2>
        <p className={shared.text}>Escríbenos y cuéntanos qué necesita tu negocio.</p>
        <div className={styles.actions}>
          <WhatsAppButton label="Escribir por WhatsApp" />
        </div>
        <p className={styles.note}>
          <span className={shared.demo}>Preliminary</span> El formulario de contacto se incorpora
          en una próxima fase.
        </p>
      </div>
      <Statusbar>
        <span>Contact.exe</span>
        <span>Trujillo, Perú</span>
      </Statusbar>
    </div>
  )
}
