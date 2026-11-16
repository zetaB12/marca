import { useState } from 'react'
import { DocumentIcon, FolderIcon, OpenFolderIcon } from '../../components/PixelIcon/pixelIcons'
import { PROJECT_CATEGORIES, PROJECTS } from '../../data/projects'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './ProjectsApp.module.css'

/** Explorador de proyectos: carpetas por categoría (datos de demostración). */
export default function ProjectsApp() {
  const [categoryId, setCategoryId] = useState(PROJECT_CATEGORIES[0].id)
  const category = PROJECT_CATEGORIES.find((c) => c.id === categoryId) ?? PROJECT_CATEGORIES[0]
  const items = PROJECTS.filter((p) => p.categoryId === category.id)

  return (
    <div className={shared.app}>
      <div className={styles.explorer}>
        <nav className={styles.tree} aria-label="Project folders">
          <ul>
            {PROJECT_CATEGORIES.map((c) => {
              const active = c.id === category.id
              const Icon = active ? OpenFolderIcon : FolderIcon
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`${styles.folder} ${active ? styles.active : ''}`}
                    aria-current={active}
                    onClick={() => setCategoryId(c.id)}
                  >
                    <Icon size={16} />
                    <span>{c.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <section className={styles.content} aria-label={category.name}>
          <h2 className={shared.heading}>{category.name}</h2>
          {items.length === 0 ? (
            <p className={shared.text}>This folder is empty.</p>
          ) : (
            <ul className={styles.files}>
              {items.map((p) => (
                <li key={p.id} className={styles.file}>
                  <DocumentIcon size={32} />
                  <div>
                    <h3 className={styles.name}>{p.name}</h3>
                    <p className={styles.desc}>{p.description}</p>
                    <p className={styles.tags}>
                      {p.demo && <span className={shared.demo}>DEMO</span>}
                      {p.tech.map((t) => (
                        <span key={t} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <Statusbar>
        <span>{items.length} object(s)</span>
        <span>Demo data</span>
      </Statusbar>
    </div>
  )
}
