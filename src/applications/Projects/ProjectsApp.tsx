import { useState } from 'react'
import { ArrowUpRightIcon } from '../../components/PixelIcon/pixelIcons'
import { PROJECT_CATEGORIES, PROJECTS } from '../../data/projects'
import styles from './ProjectsApp.module.css'

const ALL = 'all'

/** Galería "Selected work": filtros por categoría y tarjetas de 3 por fila (datos de demostración). */
export default function ProjectsApp() {
  const [filter, setFilter] = useState<string>(ALL)
  const filters = [{ id: ALL, name: 'Todos' }, ...PROJECT_CATEGORIES]
  const items = PROJECTS.filter((p) => filter === ALL || p.categoryId === filter)

  return (
    <div className={styles.app}>
      <header className={styles.head}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <span>/</span> Portafolio
          </p>
          <h1 className={styles.title}>
            Selected <em>work.</em>
          </h1>
          <p className={styles.lead}>Proyectos reales, ideas con impacto.</p>
        </div>

        <div className={styles.filters} role="group" aria-label="Filtrar proyectos">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={styles.filter}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>
      </header>

      {items.length === 0 ? (
        <p className={styles.empty}>Aún no hay proyectos en esta categoría.</p>
      ) : (
        <ul className={styles.grid}>
          {items.map((p, i) => (
            <li key={p.id}>
              <article className={styles.card} tabIndex={0}>
                <div className={styles.thumb} style={{ background: p.tone }}>
                  {p.image ? (
                    <img src={p.image} alt="" loading="lazy" />
                  ) : (
                    <span className={styles.ph}>{p.name}</span>
                  )}
                  {p.demo && <span className={styles.demo}>Demo</span>}
                </div>
                <div className={styles.info}>
                  <div>
                    <h2 className={styles.name}>
                      {String(i + 1).padStart(2, '0')} / {p.name}
                    </h2>
                    <p className={styles.sub}>{p.subtitle}</p>
                  </div>
                  <ArrowUpRightIcon size={20} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
