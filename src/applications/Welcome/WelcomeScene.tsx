import { ComputerIcon } from "../../components/PixelIcon/pixelIcons";
import { useDesktopStore } from "../../store/desktopStore";
import styles from "./WelcomeScene.module.css";

const FOLDERS = [
  "Desarrollo Web",
  "Sistemas a medida",
  "Automatizaciones",
  "Optimización de negocio",
];

const BARS = [16, 22, 27, 37, 48, 61, 78];

/** Barra de título de las ventanitas (solo decorativa: los tres botones no hacen nada). */
function TitleBar({ title, folder }: { title: string; folder?: boolean }) {
  return (
    <span className={styles.titlebar}>
      {folder ? <YellowFolder /> : <ComputerIcon size={16} />}
      <span className={styles.title}>{title}</span>
      <span className={styles.controls} aria-hidden>
        <i className={styles.min} />
        <i className={styles.max} />
        <i className={styles.close} />
      </span>
    </span>
  );
}

function YellowFolder() {
  return (
    <svg
      className={styles.folder}
      viewBox="0 0 16 13"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <path fill="#171717" d="M0 0h7v2h9v11H0z" />
      <path fill="#d9971c" d="M1 1h5v2h9v9H1z" />
      <path fill="#ffd45c" d="M1 4h14v8H1z" />
      <path fill="#ffe9a3" d="M1 4h14v1H1z" />
    </svg>
  );
}

/** Collage de ventanas de la derecha. Las medidas siguen la maqueta (lienzo de 506 × 412). */
export default function WelcomeScene() {
  const launch = useDesktopStore((s) => s.launch);

  return (
    <div className={styles.scene}>
      <div className={styles.canvas}>
        <button
          type="button"
          className={`${styles.window} ${styles.project}`}
          onClick={() => launch("projects")}
          aria-label="Ver proyectos web"
        >
          <TitleBar title="Proyecto_web.exe" />
          <span className={styles.site}>
            <span className={styles.siteNav}>
              <span className={styles.siteBrand}>
                Uyara
                <small>Medicina Estética Integral</small>
              </span>
              <span>Inicio</span>
              <span>Tratamientos</span>
              <span>Contacto</span>
            </span>
            <span className={styles.siteHero}>
              <span className={styles.siteTitle}>
                Resalta tu
                <br />
                belleza natural
              </span>
              <span className={styles.siteButton}>Agendar cita →</span>
            </span>
          </span>
        </button>

        {/* Foto recortada de la maqueta. La ventana del sistema tapa su esquina inferior derecha. */}
        <img
          className={styles.photo}
          src="/image/uyara-hero.png"
          alt=""
          width={188}
          height={158}
          draggable={false}
        />

        <button
          type="button"
          className={`${styles.window} ${styles.servicesWin}`}
          onClick={() => launch("services")}
          aria-label="Ver servicios"
        >
          <TitleBar title="Servicios.exe" folder />
          <span className={styles.panel}>
            {FOLDERS.map((name) => (
              <span key={name} className={styles.row}>
                <YellowFolder />
                {name}
              </span>
            ))}
          </span>
        </button>

        <div className={`${styles.window} ${styles.system}`} aria-hidden>
          <TitleBar title="Sistema_gestion.exe" />
          <span className={styles.dashboard}>
            <span className={styles.sidebar}>
              <svg viewBox="0 0 20 112" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 10l8-7 8 7M4 9v9h12V9M8 18v-5h4v5" />
                <circle cx="8" cy="37" r="3.5" />
                <path d="M2 49v-3q6-6 12 0v3M14 35q4 2 0 6M16 44l3 3v2" />
                <path d="M3 66h14v13H3zM3 70h14M7 63v5M13 63v5M6 74h2M11 74h3" />
                <path d="M3 108v-6h3v6M9 108V96h3v12M15 108V91h3v17" />
              </svg>
            </span>
            <span className={styles.card}>
              <span className={styles.cardLabel}>Citas del mes</span>
              <span className={styles.metric}>
                +42%
                <svg viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M1 14l6-6 4 3 9-9M13 2h7v7" />
                </svg>
              </span>
              <span className={styles.bars}>
                {BARS.map((h) => (
                  <i key={h} style={{ height: `${h}%` }} />
                ))}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
