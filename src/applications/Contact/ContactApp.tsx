import { useState } from "react";
import { ChatIcon } from "../../components/PixelIcon/pixelIcons";
import { WHATSAPP_ENABLED, whatsappUrl } from "../../data/site";
import styles from "./ContactApp.module.css";

/** Contacto.exe: titular, mensaje y envío por WhatsApp (abre el chat con el texto ya escrito). */
export default function ContactApp() {
  const [message, setMessage] = useState("");

  return (
    <div className={styles.app}>
      <section className={styles.copy}>
        <p className={styles.eyebrow}>
          <span>/</span> Contacto
        </p>
        <h1 className={styles.title}>
          ¿Tienes un <em>proyecto</em> en mente?
        </h1>
        <p className={styles.lead}>
          Cuéntanos qué necesita tu negocio y te respondemos por WhatsApp.
        </p>

        <label className={styles.field}>
          <span className="sr-only">Tu mensaje</span>
          <textarea
            className={styles.input}
            rows={4}
            maxLength={600}
            value={message}
            placeholder="Hola, quiero información sobre…"
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        {WHATSAPP_ENABLED ? (
          <a
            className={styles.btn}
            href={whatsappUrl(
              message.trim() || "Hola, me gustaría hablar sobre mi proyecto.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ChatIcon size={26} /> Escríbeme por WhatsApp
          </a>
        ) : (
          <span className={`${styles.btn} ${styles.off}`} role="note">
            <ChatIcon size={26} /> WhatsApp · configura VITE_WHATSAPP_NUMBER
          </span>
        )}
      </section>
    </div>
  );
}
