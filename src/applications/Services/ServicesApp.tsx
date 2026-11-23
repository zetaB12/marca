import { SERVICES } from "../../data/services";
import { ArrowIcon, FolderIcon } from "../../components/PixelIcon/pixelIcons";
import { useDesktopStore } from "../../store/desktopStore";
import styles from "./ServicesApp.module.css";

/** Servicios.exe: catálogo en tarjetas con la misma jerarquía que Mis proyectos. */
export default function ServicesApp() {
  const launch = useDesktopStore((s) => s.launch);

  return (
    <div className={styles.app}>
      <header className={styles.head}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <span>/</span> Servicios
          </p>
          <h1 className={styles.title}>
            What we <em>create.</em>
          </h1>
          <p className={styles.lead}>Soluciones digitales hechas a medida.</p>
        </div>
        <span className={styles.folder} aria-hidden>
          <FolderIcon size={72} />
        </span>
      </header>

      <ul className={styles.grid} aria-label="Servicios">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.id}>
              <article className={styles.card}>
                <span className={styles.glyph}>
                  <Icon size={32} />
                </span>
                <h2 className={styles.name}>
                  {s.title[0]} {s.title[1]}
                </h2>
                <p className={styles.sub}>{s.summary}</p>
                <div className={styles.foot}>
                  <span className={styles.num}>
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(SERVICES.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className={styles.go}
                    aria-label={`Consultar ${s.name}`}
                    onClick={() => launch("contact")}
                  >
                    <ArrowIcon size={20} />
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
