import { findNode, findPath, pathLabel } from '../../data/filesystem'
import { useExplorerStore } from '../../store/explorerStore'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './NotepadApp.module.css'

/** Visor de texto de solo lectura al estilo del Bloc de notas clásico. */
export default function NotepadApp() {
  const fileId = useExplorerStore((s) => s.fileId)
  const file = fileId ? findNode(fileId) : null
  const path = fileId ? findPath(fileId) : null

  return (
    <div className={shared.app}>
      <textarea
        className={styles.text}
        readOnly
        spellCheck={false}
        aria-label={file ? `${file.name} (solo lectura)` : 'Bloc de notas'}
        value={file?.content ?? ''}
      />
      <Statusbar>
        <span>{file ? file.name : 'Sin título'}</span>
        <span className={styles.path}>{path ? pathLabel(path) : ''}</span>
      </Statusbar>
    </div>
  )
}
