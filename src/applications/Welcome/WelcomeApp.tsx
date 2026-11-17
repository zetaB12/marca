import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ArrowUpRightIcon,
  UserIcon,
} from "../../components/PixelIcon/pixelIcons";
import { WHATSAPP_ENABLED, whatsappUrl } from "../../data/site";
import { SERVICES } from "../../data/services";
import { useDesktopStore } from "../../store/desktopStore";
import { useNavStore } from "../../store/navStore";
import styles from "./WelcomeApp.module.css";

/** Servicios que se presentan en Welcome. Nombre visible + id del catálogo (descripción e icono salen de ahí). */
const FEATURED = [
  { id: "web", name: "Desarrollo web" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "software", name: "Software y sistemas" },
  { id: "automation", name: "Automatización" },
  { id: "ai", name: "Soluciones con IA" },
] as const;

export default function WelcomeApp() {
  const ref = useRef<HTMLDivElement>(null);
  const launch = useDesktopStore((s) => s.launch);
  const selectService = useNavStore((s) => s.selectService);
  const setAboutTab = useNavStore((s) => s.setAboutTab);

  useLayoutEffect(() => {
    const el = ref.current;
    const motionOff =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "off";
    if (!el || motionOff) return;
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.reveal}`, {
        opacity: 0,
        y: 10,
        duration: 0.4,
        stagger: 0.07,
        delay: 0.1,
        ease: "power2.out",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const openService = (id: string) => {
    selectService(id);
    launch("services");
  };

  const openBehind = () => {
    setAboutTab("behind");
    launch("about");
  };

  return (
    <div ref={ref} className={styles.app}>
      <div className={styles.main}>
        <section className={styles.copy}>
          <p className={`${styles.eyebrow} ${styles.reveal}`}>
            Diseño y desarrollo digital · Trujillo, Perú
          </p>

          <h1 className={`${styles.headline} ${styles.reveal}`}>
            <span className={styles.strong}>
              Creo webs, sistemas y soluciones digitales
            </span>{" "}
            para hacer crecer tu negocio.
          </h1>

          <p className={`${styles.description} ${styles.reveal}`}>
            Ayudo a negocios a tener una mejor presencia digital, vender más por
            Internet y optimizar sus procesos.
          </p>

          <div className={`${styles.actions} ${styles.reveal}`}>
            {/* WhatsApp con mensaje listo si hay número configurado; si no, abre Contact. */}
            {WHATSAPP_ENABLED ? (
              <a
                className={`${styles.cta} ${styles.primary}`}
                href={whatsappUrl(
                  "Hola, me gustaría hablar sobre mi proyecto.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hablemos de tu proyecto <ArrowUpRightIcon size={16} />
              </a>
            ) : (
              <button
                type="button"
                className={`${styles.cta} ${styles.primary}`}
                onClick={() => launch("contact")}
              >
                Hablemos de tu proyecto <ArrowUpRightIcon size={16} />
              </button>
            )}
            <button
              type="button"
              className={styles.cta}
              onClick={() => launch("projects")}
            >
              Conoce mi trabajo <ArrowUpRightIcon size={16} />
            </button>
          </div>

          <p className={`${styles.promise} ${styles.reveal}`}>
            Soluciones a medida. Sin depender de plantillas. Tecnología pensada
            para tu negocio.
          </p>
        </section>

        <aside className={styles.aside} aria-label="Servicios">
          <div
            className={`${styles.group} ${styles.reveal}`}
            role="group"
            aria-labelledby="welcome-services"
          >
            <span id="welcome-services" className={styles.legend}>
              Servicios
            </span>
            <ul className={styles.services}>
              {FEATURED.map(({ id, name }) => {
                const service = SERVICES.find((s) => s.id === id);
                if (!service) return null;
                const Icon = service.icon;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={styles.service}
                      onClick={() => openService(id)}
                    >
                      <Icon size={32} />
                      <span className={styles.serviceText}>
                        <span className={styles.serviceName}>{name}</span>
                        <span className={styles.serviceDesc}>
                          {service.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            className={`${styles.behind} ${styles.reveal}`}
            onClick={openBehind}
          >
            <UserIcon size={16} />
            Detrás de Neal
            <ArrowUpRightIcon size={16} />
          </button>
        </aside>
      </div>

      <footer className={styles.status}>
        <span>N. Digital Studio</span>
        <span>Versión 1.0.0</span>
      </footer>
    </div>
  );
}
