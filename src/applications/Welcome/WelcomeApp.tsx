import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRightIcon } from "../../components/PixelIcon/pixelIcons";
import WallpaperScene from "../../components/Wallpaper/WallpaperScene";
import { WHATSAPP_ENABLED, whatsappUrl } from "../../data/site";
import { useDesktopStore } from "../../store/desktopStore";
import styles from "./WelcomeApp.module.css";

/** Iconos pixel de los servicios (trazos de 2px, sin suavizado). */
const ICON_PROPS = {
  width: 40,
  height: 40,
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

function ChartIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="19" width="6" height="9" />
      <rect x="13" y="12" width="6" height="16" />
      <rect x="22" y="4" width="6" height="24" />
    </svg>
  );
}

const SERVICES = [
  { icon: WebIcon, lines: ["Desarrollo", "Web"] },
  { icon: LayersIcon, lines: ["Sistemas", "a medida"] },
  { icon: ChartIcon, lines: ["Optimización", "de negocio"] },
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
        {/* Paisaje del fondo del escritorio, con la misma paleta según la hora. */}
        <div className={styles.scene}>
          <WallpaperScene />
        </div>

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
            Construimos experiencias digitales que hacen avanzar{" "}
            <em>tu negocio.</em>
          </h2>

          <p className={`${styles.description} ${styles.reveal}`}>
            Diseño web, desarrollo de plataformas y soluciones digitales
            creadas para marcas que buscan destacar.
          </p>

          <div className={`${styles.actions} ${styles.reveal}`}>
            <button
              type="button"
              className={`${styles.cta} ${styles.primary}`}
              onClick={() => launch("projects")}
            >
              Ver proyectos <ArrowUpRightIcon size={18} />
            </button>
            {/* WhatsApp con mensaje listo si hay número configurado; si no, abre Contact. */}
            {WHATSAPP_ENABLED ? (
              <a
                className={styles.cta}
                href={whatsappUrl("Hola, me gustaría hablar sobre mi proyecto.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hablemos <ArrowUpRightIcon size={18} />
              </a>
            ) : (
              <button
                type="button"
                className={styles.cta}
                onClick={() => launch("contact")}
              >
                Hablemos <ArrowUpRightIcon size={18} />
              </button>
            )}
          </div>

          <ul className={`${styles.services} ${styles.reveal}`}>
            {SERVICES.map(({ icon: Icon, lines }) => (
              <li key={lines.join(" ")} className={styles.service}>
                <Icon />
                <span>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className={styles.status}>
        <span className={styles.brandName}>N. Digital Studio</span>
        <span>Versión 2.0.0</span>
      </footer>
    </div>
  );
}
