import { ChatIcon } from '../PixelIcon/pixelIcons'
import { WHATSAPP_ENABLED, whatsappUrl } from '../../data/site'
import styles from './WhatsAppButton.module.css'

export default function WhatsAppButton({
  label = 'Hablar por WhatsApp',
  message,
}: {
  label?: string
  /** Texto del chat; si está vacío se usa el mensaje por defecto. */
  message?: string
}) {
  if (!WHATSAPP_ENABLED) {
    return (
      <span className={`${styles.btn} ${styles.off}`} role="note">
        <ChatIcon size={16} /> {label} · configura VITE_WHATSAPP_NUMBER
      </span>
    )
  }
  return (
    <a className={styles.btn} href={whatsappUrl(message?.trim() || undefined)} target="_blank" rel="noopener noreferrer">
      <ChatIcon size={16} /> {label}
    </a>
  )
}
