import {
  ArrowUpRightIcon,
  AutomationIcon,
  CartIcon,
  ServicesIcon,
  UserIcon,
  WebIcon,
} from "../../components/PixelIcon/pixelIcons";
import { ABOUT_PROFILE } from "../../data/about";
import { useNavStore, type AboutTab } from "../../store/navStore";
import { useWindowStore } from "../../store/windowStore";
import Statusbar from "../shared/Statusbar";
import shared from "../shared/shared.module.css";
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

/** Información de la agencia. El contenido editorial definitivo llega en la Fase 3. */
export default function AboutApp() {
  const tab = useNavStore((s) => s.aboutTab);
  const setTab = useNavStore((s) => s.setAboutTab);
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div className={shared.app}>
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
        className={`${shared.main} ${styles.panel} ${tab === "agency" ? styles.panelFit : ""}`}
      >
        {tab === "behind" ? (
          <div className={styles.behind}>
            <div className={styles.photo}>
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
            <div className={styles.bio}>
              <h2 className={shared.heading}>
                {ABOUT_PROFILE.name || "Detrás de Neal"}
              </h2>
              {ABOUT_PROFILE.role && (
                <p className={styles.role}>{ABOUT_PROFILE.role}</p>
              )}
              {ABOUT_PROFILE.sections.map((section) => (
                <section key={section.id} className={styles.section}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  {section.body ? (
                    <p className={shared.text}>{section.body}</p>
                  ) : (
                    <p className={styles.pending}>
                      <span className={shared.demo}>Pendiente</span> Tu texto va
                      aquí.
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        ) : tab === "agency" ? (
          <div className={styles.agency}>
            <h2 className={`${shared.heading} ${styles.hero}`}>
              Ideas que merecen hacerse realidad.
            </h2>
            <p className={`${shared.text} ${styles.lead}`}>
              Creamos soluciones digitales para negocios que quieren dar el
              siguiente paso.
            </p>
            <hr className={styles.rule} />
            <h3 className={styles.subtitle}>¿En qué podemos ayudarte?</h3>
            <ul className={styles.help}>
              {HELP.map(({ icon: Icon, title, text }) => (
                <li key={title} className={styles.helpItem}>
                  <span className={styles.helpIcon}>
                    <Icon size={32} />
                  </span>
                  <div>
                    <strong className={styles.helpTitle}>{title}</strong>
                    <p className={styles.helpText}>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <hr className={styles.rule} />
            <div className={styles.cta}>
              <div>
                <h3 className={styles.ctaTitle}>¿Tienes algo en mente?</h3>
                <p className={styles.ctaText}>
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
          <>
            <h2 className={shared.heading}>Cómo trabajamos</h2>
            <ol className={styles.steps}>
              {PROCESS.map(([name, text]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <Statusbar>
        <span>Nosotros.exe</span>
        <span>Trujillo, Perú</span>
      </Statusbar>
    </div>
  );
}
