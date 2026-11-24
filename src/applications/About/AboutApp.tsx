import type { ReactNode } from "react";
import {
  ArrowUpRightIcon,
  AutomationIcon,
  CartIcon,
  FolderIcon,
  ServicesIcon,
  UserIcon,
  WebIcon,
} from "../../components/PixelIcon/pixelIcons";
import { ABOUT_PROFILE } from "../../data/about";
import { useNavStore, type AboutTab } from "../../store/navStore";
import { useWindowStore } from "../../store/windowStore";
import styles from "./AboutApp.module.css";

const PROCESS = [
  [
    "Descubrimiento",
    "Conocemos tu negocio, tus necesidades y lo que quieres conseguir.",
  ],
  ["Estrategia", "Definimos el camino y encontramos la solución adecuada."],
  ["Diseño", "Damos forma a una experiencia pensada para tus usuarios."],
  ["Desarrollo", "Convertimos la propuesta en una solución funcional."],
  ["Lanzamiento", "Probamos, ponemos en marcha y dejamos todo listo."],
  ["Acompañamiento", "Seguimos mejorando la solución según tus necesidades."],
] as const;

const HELP = [
  {
    icon: WebIcon,
    title: "Presencia digital",
    text: "Una marca que destaque y conecte con sus clientes.",
  },
  {
    icon: CartIcon,
    title: "Ventas online",
    text: "Experiencias digitales para vender mejor.",
  },
  {
    icon: ServicesIcon,
    title: "Sistemas",
    text: "Herramientas para trabajar de forma más eficiente.",
  },
  {
    icon: AutomationIcon,
    title: "Automatización e IA",
    text: "Menos tareas repetitivas, más tiempo para crecer.",
  },
] as const;

const TABS: { id: AboutTab; label: string }[] = [
  { id: "behind", label: "Detrás de Neal" },
  { id: "agency", label: "Agencia" },
  { id: "process", label: "Proceso" },
];

/** Iconos de trazo pixel para las filas de "Detrás de Neal". */
const SVG_PROPS = {
  width: 36,
  height: 36,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  shapeRendering: "crispEdges" as const,
  "aria-hidden": true,
};

const PersonGlyph = () => (
  <svg
    {...SVG_PROPS}
    shapeRendering="geometricPrecision"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="16" cy="10.5" r="6" />
    <path d="M4.5 28c0-6.5 5-10.5 11.5-10.5S27.5 21.5 27.5 28" />
  </svg>
);

const CodeGlyph = () => (
  <svg {...SVG_PROPS}>
    <path d="M11 9l-7 7 7 7M21 9l7 7-7 7M18 6l-4 20" />
  </svg>
);

const FlagGlyph = () => (
  <svg {...SVG_PROPS}>
    <path d="M7 28V4M7 6h18v12H7" />
  </svg>
);

const BEHIND_ROWS: { id: string; icon: () => ReactNode }[] = [
  { id: "who", icon: PersonGlyph },
  { id: "experience", icon: CodeGlyph },
  { id: "why", icon: FlagGlyph },
];

/** Nosotros.exe: pestañas Detrás de Neal / Agencia / Proceso (referencia image/nosotros.png). */
export default function AboutApp() {
  const tab = useNavStore((s) => s.aboutTab);
  const setTab = useNavStore((s) => s.setAboutTab);
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div className={styles.app}>
      <div
        role="tablist"
        aria-label="Secciones de Nosotros"
        className={styles.tabs}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`about-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="about-panel"
            className={`${styles.tab} ${tab === t.id ? styles.selected : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id="about-panel"
        role="tabpanel"
        aria-labelledby={`about-tab-${tab}`}
        className={styles.panel}
      >
        {tab === "behind" ? (
          <div className={styles.behind}>
            <figure className={styles.portrait}>
              <div className={styles.frame}>
                {ABOUT_PROFILE.photo ? (
                  <img
                    src={ABOUT_PROFILE.photo}
                    alt={ABOUT_PROFILE.name || "Foto"}
                  />
                ) : (
                  <span className={styles.photoEmpty}>
                    <UserIcon size={48} />
                    <span>Tu foto aquí</span>
                  </span>
                )}
              </div>
              <figcaption className={styles.badge}>
                <span className={styles.badgeBar}>
                  {(ABOUT_PROFILE.name || "Neal") + ".exe"}
                  <span aria-hidden>×</span>
                </span>
                <span className={styles.badgeRole}>
                  {ABOUT_PROFILE.role || "Founder / Digital Creator"}
                </span>
              </figcaption>
            </figure>

            <div className={styles.bio}>
              <header className={styles.head}>
                <div>
                  <p className={styles.eyebrow}>
                    <span>/</span> Detrás de Neal
                  </p>
                  <h1 className={styles.title}>
                    Conoce la historia detrás de <em>NEAL.PE</em>
                  </h1>
                </div>
                <span className={styles.folder} aria-hidden>
                  <FolderIcon size={64} />
                </span>
              </header>

              <ul className={styles.rows}>
                {ABOUT_PROFILE.sections.map((section, i) => {
                  const Glyph = BEHIND_ROWS[i % BEHIND_ROWS.length].icon;
                  return (
                    <li key={section.id} className={styles.row}>
                      <span className={styles.rowIcon}>
                        <Glyph />
                      </span>
                      <div>
                        <h2 className={styles.rowTitle}>{section.title}</h2>
                        <p className={styles.rowText}>
                          {section.body || "Tu texto va aquí."}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : tab === "agency" ? (
          <div className={styles.agency}>
            <p className={styles.eyebrow}>
              <span>/</span> Agencia
            </p>
            <h1 className={styles.title}>
              Ideas que merecen hacerse <em>realidad.</em>
            </h1>
            <p className={styles.lead}>
              Creo soluciones digitales para negocios que quieren dar el
              siguiente paso.
            </p>
            <h2 className={styles.subtitle}>¿En qué podemos ayudarte?</h2>
            <ul className={styles.help}>
              {HELP.map(({ icon: Icon, title, text }) => (
                <li key={title} className={styles.helpItem}>
                  <span className={styles.helpIcon}>
                    <Icon size={32} />
                  </span>
                  <div>
                    <strong className={styles.helpTitle}>{title}</strong>
                    <p className={styles.rowText}>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.cta}>
              <div>
                <h3 className={styles.rowTitle}>¿Tienes algo en mente?</h3>
                <p className={styles.rowText}>
                  Cuéntanos tu idea. Podemos darle forma juntos.
                </p>
              </div>
              <button
                type="button"
                className={styles.ctaButton}
                onClick={() => openWindow("contact")}
              >
                Hablemos de tu proyecto <ArrowUpRightIcon size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.agency}>
            <p className={styles.eyebrow}>
              <span>/</span> Proceso
            </p>
            <h1 className={styles.title}>
              Cómo <em>trabajamos.</em>
            </h1>
            <ol className={styles.steps}>
              {PROCESS.map(([name, text]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <footer className={styles.status}>
        <span className={styles.brandName}>N. Digital Studio</span>
        <span>Trujillo, Perú</span>
      </footer>
    </div>
  );
}
