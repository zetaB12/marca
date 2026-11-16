import { useState, type KeyboardEvent } from 'react'
import SystemDialog from '../../components/SystemDialog/SystemDialog'
import parts from '../../components/SystemDialog/dialogParts.module.css'
import { AboutIcon, DocumentIcon, FolderIcon } from '../../components/PixelIcon/pixelIcons'
import { useRecycleStore } from '../../store/recycleStore'
import { playSound } from '../../utils/sound'
import Statusbar from '../shared/Statusbar'
import shared from '../shared/shared.module.css'
import styles from './RecycleBinApp.module.css'

interface Message {
  title: string
  text: string
  /** Si existe, es una confirmación Sí/No; si no, un aviso con Aceptar. */
  onConfirm?: () => void
}

/** Papelera de reciclaje: contenido de humor con acciones reales (abrir, restaurar, eliminar, vaciar). */
export default function RecycleBinApp() {
  const items = useRecycleStore((s) => s.items)
  const selectedId = useRecycleStore((s) => s.selectedId)
  const select = useRecycleStore((s) => s.select)
  const remove = useRecycleStore((s) => s.remove)
  const empty = useRecycleStore((s) => s.empty)
  const [message, setMessage] = useState<Message | null>(null)

  const selected = items.find((i) => i.id === selectedId) ?? null

  const open = () => selected && setMessage({ title: selected.name, text: selected.message })

  const restore = () => {
    if (!selected) return
    if (selected.restoreError) {
      setMessage({ title: 'Error Restoring File', text: selected.restoreError })
      return
    }
    remove(selected.id)
    setMessage({ title: 'Restore', text: `"${selected.name}" se restauró en ${selected.origin}.` })
  }

  const askDelete = () => {
    if (!selected) return
    const { id, name } = selected
    setMessage({
      title: 'Confirm File Delete',
      text: `¿Seguro que quieres eliminar "${name}" para siempre?`,
      onConfirm: () => {
        remove(id)
        playSound('close')
      },
    })
  }

  const askEmpty = () =>
    setMessage({
      title: 'Confirm Multiple File Delete',
      text: `¿Seguro que quieres eliminar estos ${items.length} elemento(s)? No hay vuelta atrás. Bueno, sí: reinicia el escritorio.`,
      onConfirm: () => {
        empty()
        playSound('close')
      },
    })

  const onRowKeys = (e: KeyboardEvent) => {
    if (e.key === 'Enter') open()
    else if (e.key === 'Delete') askDelete()
    else return
    e.preventDefault()
  }

  return (
    <div className={shared.app}>
      <div className={styles.toolbar} role="toolbar" aria-label="Recycle Bin actions">
        <button type="button" className={styles.tool} disabled={!selected} onClick={open}>
          Open
        </button>
        <button type="button" className={styles.tool} disabled={!selected} onClick={restore}>
          Restore
        </button>
        <button type="button" className={styles.tool} disabled={!selected} onClick={askDelete}>
          Delete
        </button>
        <button type="button" className={styles.tool} disabled={items.length === 0} onClick={askEmpty}>
          Empty Recycle Bin
        </button>
      </div>

      <div className={styles.list} role="listbox" aria-label="Deleted items">
        <div className={`${styles.row} ${styles.head}`} aria-hidden>
          <span>Name</span>
          <span className={styles.hideSmall}>Original Location</span>
          <span className={styles.hideSmall}>Date Deleted</span>
          <span>Size</span>
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>
            Recycle Bin is empty.
            <br />
            Tus recuerdos ya no están. Reinicia el escritorio para recuperarlos.
          </p>
        ) : (
          items.map((item) => {
            const Icon = item.kind === 'folder' ? FolderIcon : DocumentIcon
            const active = item.id === selectedId
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={active}
                className={`${styles.row} ${styles.item} ${active ? styles.selected : ''}`}
                onClick={() => select(item.id)}
                onFocus={() => select(item.id)}
                onDoubleClick={open}
                onKeyDown={onRowKeys}
              >
                <span className={styles.name}>
                  <Icon size={16} />
                  <span>{item.name}</span>
                </span>
                <span className={styles.hideSmall}>{item.origin}</span>
                <span className={styles.hideSmall}>{item.deleted}</span>
                <span>{item.size}</span>
              </button>
            )
          })
        )}
      </div>

      <Statusbar>
        <span>{items.length} object(s)</span>
        <span>{selected ? selected.type : 'Recycle Bin'}</span>
      </Statusbar>

      {message && (
        <SystemDialog title={message.title} icon={<AboutIcon size={16} />} onClose={() => setMessage(null)}>
          <div className={parts.body}>
            <p className={parts.question}>{message.text}</p>
            <div className={parts.buttons}>
              {message.onConfirm ? (
                <>
                  <button
                    type="button"
                    className={parts.btn}
                    data-autofocus
                    onClick={() => {
                      message.onConfirm?.()
                      setMessage(null)
                    }}
                  >
                    Yes
                  </button>
                  <button type="button" className={parts.btn} onClick={() => setMessage(null)}>
                    No
                  </button>
                </>
              ) : (
                <button type="button" className={parts.btn} data-autofocus onClick={() => setMessage(null)}>
                  OK
                </button>
              )}
            </div>
          </div>
        </SystemDialog>
      )}
    </div>
  )
}
