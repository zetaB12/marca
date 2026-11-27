import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ArrowUpRightIcon,
  ArrowIcon,
} from "../../components/PixelIcon/pixelIcons";
import { WHATSAPP_ENABLED, whatsappUrl } from "../../data/site";
import { useDesktopStore } from "../../store/desktopStore";
import WelcomeScene from "./WelcomeScene";
import styles from "./WelcomeApp.module.css";

/** Iconos de línea de la barra inferior y de los botones (trazos de 2px, sin suavizado). */
const ICON_PROPS = {
  width: 38,
  height: 38,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  shapeRendering: "crispEdges" as const,
  "aria-hidden": true,
};

function CodeIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="5" width="26" height="22" />
      <path d="M3 10h26" />
      <path d="M11 15l-4 4 4 4M21 15l4 4-4 4M18 14l-4 10" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M16 4L3 11l13 7 13-7z" />
      <path d="M3 16l13 7 13-7" />
      <path d="M3 21l13 7 13-7" />
    </svg>
  );
}

/** Rayo: de línea como los demás; al pasar el puntero se rellena de amarillo. */
function BoltIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path className={styles.bolt} d="M17 2L6 18h8l-3 12 15-18h-9l5-10z" />
    </svg>
  );
}

function FolderLineIcon() {
  return (
    <svg {...ICON_PROPS} width={24} height={24} strokeWidth={2.6}>
      <path d="M4 7h9l3 4h12v15H4z" />
    </svg>
  );
}

function ChatLineIcon() {
  return (
    <svg {...ICON_PROPS} width={24} height={24} strokeWidth={2.6}>
      <path d="M4 6h24v17H14l-6 6v-6H4z" />
      <path d="M10 14h2M15 14h2M20 14h2" />
    </svg>
  );
}

const SERVICES = [
  { icon: CodeIcon, lines: ["Desarrollo Web", "y Landing Pages"] },
  { icon: LayersIcon, lines: ["Sistemas y", "Plataformas"] },
  { icon: BoltIcon, lines: ["Automatizaciones", "y CRM"] },
];

export default function WelcomeApp() {
  const ref = useRef<HTMLDivElement>(null);
  const launch = useDesktopStore((s) => s.launch);

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

  return (
    <div ref={ref} className={styles.app}>
      <div className={styles.main}>
        <section className={styles.copy}>
          <div className={styles.brand}>
            <h1 className={`${styles.logo} ${styles.reveal}`}>
              NEAL<span className={styles.dot}>.</span>PE
            </h1>
            <p className={`${styles.tagline} ${styles.reveal}`}>
              Digital Experience Studio
            </p>
          </div>

          <span className={`${styles.rule} ${styles.reveal}`} aria-hidden />

          <h2 className={`${styles.headline} ${styles.reveal}`}>
            <span>Transformamos ideas en </span>
            <span>experiencias digitales </span>
            <span>
              que hacen <em>crecer </em>
            </span>
            <span>
              <em>negocios.</em>
              <i className={styles.caret} aria-hidden />
            </span>
          </h2>

          <p className={`${styles.description} ${styles.reveal}`}>
            Diseño, desarrollo y tecnología para empresas que quieren destacar
            en el mundo digital.
          </p>

          <div className={`${styles.actions} ${styles.reveal}`}>
            <button
              type="button"
              className={`${styles.cta} ${styles.primary}`}
              onClick={() => launch("projects")}
            >
              <FolderLineIcon />
              Ver proyectos
              <ArrowIcon size={18} className={styles.arrow} />
            </button>
            {/* WhatsApp con mensaje listo si hay número configurado; si no, abre Contact. */}
            {WHATSAPP_ENABLED ? (
              <a
                className={styles.cta}
                href={whatsappUrl(
                  "Hola, me gustaría hablar sobre mi proyecto.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatLineIcon />
                Hablemos
                <ArrowUpRightIcon size={18} className={styles.arrow} />
              </a>
            ) : (
              <button
                type="button"
                className={styles.cta}
                onClick={() => launch("contact")}
              >
                <ChatLineIcon />
                Hablemos
                <ArrowUpRightIcon size={18} className={styles.arrow} />
              </button>
            )}
          </div>
        </section>

        <div className={styles.visual}>
          <WelcomeScene />
        </div>

        <ul className={`${styles.services} ${styles.reveal}`}>
          {SERVICES.map(({ icon: Icon, lines }) => (
            <li key={lines.join(" ")}>
              <button
                type="button"
                className={styles.service}
                onClick={() => launch("services")}
              >
                <Icon />
                <span>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <footer className={styles.status}>
        <span className={styles.brandName}>Trujillo, Perú</span>
        <span>Versión 1.0.1</span>
      </footer>
    </div>
  );
}
