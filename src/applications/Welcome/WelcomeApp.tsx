import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ArrowUpRightIcon,
  ArrowIcon,
  ComputerIcon,
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

function WebIcon() {
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

function RocketLineIcon() {
  return (
    <svg {...ICON_PROPS} shapeRendering="geometricPrecision">
      <path d="M12 20c1-8 7-15 17-17-2 10-9 16-17 17z" />
      <circle cx="21" cy="11" r="2.5" />
      <path d="M14 13H8l-4 7h8M19 18v6l-7 4v-8M8 24l-4 4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="19" width="6" height="9" />
      <rect x="13" y="12" width="6" height="16" />
      <rect x="22" y="4" width="6" height="24" />
    </svg>
  );
}

function ChatLineIcon() {
  return (
    <svg {...ICON_PROPS} width={24} height={24}>
      <path d="M4 6h24v17H14l-6 6v-6H4z" />
      <path d="M10 14h2M15 14h2M20 14h2" />
    </svg>
  );
}

/** Nube pixel del fondo. */
function Cloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 34 12" shapeRendering="crispEdges" aria-hidden>
      <path fill="#8d86d8" d="M0 10h3V8h3V6h4V3h3V1h7v2h3v2h5v2h4v3h2v2H0z" />
      <path fill="#c9bff0" d="M3 9h3V7h4V4h3V2h7v2h3v2h5v2h3v1z" />
    </svg>
  );
}

/** Montañas pixel de la esquina inferior derecha. */
function Mountains() {
  return (
    <svg
      className={styles.mountains}
      viewBox="0 0 160 100"
      preserveAspectRatio="xMaxYMax meet"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <path fill="#4a3d9c" d="M0 100v-4h10v-4h8v-4h8v-6h6v-6h6v-6h6v-6h4v6h6v6h6v4h6v-6h6v-8h6v-8h6v-8h6v-8h6v-6h4v-6h4v-6h4v-6h4v6h4v6h6v8h4v6h6v6h4v70z" />
      <path fill="#a77fe0" d="M100 30h4v-6h4v-6h4v6h4v6h-4v-2h-4v6h-4v-4h-4v4h-4zM38 70h6v-6h4v6h6v2h-6v-2h-4v4h-6z" />
      <path fill="#2a2470" d="M20 100v-4h10v-4h10v-6h8v-4h8v6h8v4h10v-6h8v-8h8v-8h6v-6h6v8h6v8h8v6h8v-6h8v-4h8v8h8v24z" />
      <path fill="#151a52" d="M0 100v-2h30v-4h14v-4h10v4h16v4h18v-6h12v-4h10v6h14v4h16v-6h12v-4h8v16z" />
    </svg>
  );
}

const SERVICES = [
  { icon: WebIcon, lines: ["Páginas Web", "& Landing Pages"] },
  { icon: LayersIcon, lines: ["Plataformas", "y Sistemas"] },
  { icon: RocketLineIcon, lines: ["Automatizaciones", "y CRM"] },
  { icon: ChartIcon, lines: ["Estrategia y", "Optimización"] },
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
        <Mountains />
        <Cloud className={`${styles.cloud} ${styles.cloudTop}`} />
        <Cloud className={`${styles.cloud} ${styles.cloudSide}`} />

        <section className={styles.copy}>
          <div className={styles.brand}>
            <h1 className={`${styles.logo} ${styles.reveal}`}>NEAL.PE</h1>
            <p className={`${styles.tagline} ${styles.reveal}`}>
              Digital Experience Studio
            </p>
          </div>

          <span className={`${styles.rule} ${styles.reveal}`} aria-hidden />

          <p className={`${styles.eyebrow} ${styles.reveal}`}>
            Design · Development · Technology
          </p>

          <h2 className={`${styles.headline} ${styles.reveal}`}>
            <span>Diseñamos y desarrollamos </span>
            <span>experiencias digitales </span>
            <span>
              para hacer <em>crecer tu negocio.</em>
            </span>
          </h2>

          <p className={`${styles.description} ${styles.reveal}`}>
            Creamos páginas web, plataformas y soluciones tecnológicas para
            empresas y marcas que quieren destacar en el mundo digital.
          </p>

          <div className={`${styles.actions} ${styles.reveal}`}>
            <button
              type="button"
              className={`${styles.cta} ${styles.primary}`}
              onClick={() => launch("projects")}
            >
              <ComputerIcon size={26} />
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

        <div className={`${styles.visual} ${styles.reveal}`}>
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
