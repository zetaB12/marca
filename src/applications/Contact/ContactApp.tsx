import { useState } from "react";
import WhatsAppButton from "../../components/WhatsAppButton/WhatsAppButton";
import { ABOUT_PROFILE } from "../../data/about";
import Statusbar from "../shared/Statusbar";
import shared from "../shared/shared.module.css";
import styles from "./ContactApp.module.css";

/** Contacto: redactas el mensaje y se envía por WhatsApp (abre el chat con el texto ya escrito). */
export default function ContactApp() {
  const [message, setMessage] = useState("");

  return (
    <div className={shared.app}>
      <div className={`${shared.main} ${styles.body}`}>
        <div className={styles.composer}>
          <header className={styles.from}>
            {ABOUT_PROFILE.photo && (
              <span className={styles.avatar}>
                <img src={ABOUT_PROFILE.photo} alt="" />
              </span>
            )}
            <strong className={styles.name}>Neal</strong>
            <span className={styles.channel}>WhatsApp</span>
          </header>

          <h2 className={styles.title}>¿Listo para empezar tu proyecto?</h2>
          <p className={styles.prompt}>
            Cuéntanos qué necesita tu negocio y te respondemos por WhatsApp.
          </p>

          <label className={styles.field}>
            <span className="sr-only">Tu mensaje</span>
            <textarea
              className={styles.input}
              rows={5}
              maxLength={600}
              value={message}
              placeholder="Hola, quiero información sobre…"
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          <div className={styles.actions}>
            <WhatsAppButton label="Enviar por WhatsApp" message={message} />
            <p className={styles.note}></p>
          </div>
        </div>
      </div>
      <Statusbar>
        <span>Contacto.exe</span>
        <span>Trujillo, Perú</span>
      </Statusbar>
    </div>
  );
}
