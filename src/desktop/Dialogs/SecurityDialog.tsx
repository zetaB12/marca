import { useState } from 'react'
import { ShieldIcon } from '../../components/PixelIcon/pixelIcons'
import SystemDialog from '../../components/SystemDialog/SystemDialog'
import parts from '../../components/SystemDialog/dialogParts.module.css'
import { APPS } from '../../data/apps'
import { useDesktopStore } from '../../store/desktopStore'
import { selectOpenWindows, useWindowStore } from '../../store/windowStore'

/** Ctrl+Alt+Del: lista de programas abiertos con "End Task". Solo actúa sobre este escritorio. */
export default function SecurityDialog() {
  const closeDialog = useDesktopStore((s) => s.closeDialog)
  const openDialog = useDesktopStore((s) => s.openDialog)
  const windows = useWindowStore((s) => s.windows)
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const [selected, setSelected] = useState<string | null>(null)

  const open = selectOpenWindows(windows)
  const current = open.find((w) => w.id === selected) ?? null

  return (
    <SystemDialog title="Cerrar programa" icon={<ShieldIcon size={16} />} onClose={closeDialog}>
      <div className={parts.body}>
        <p className={parts.question}>Programas en ejecución en este escritorio:</p>
        {open.length === 0 ? (
          <div className={parts.list}>
            <p className={parts.empty}>No hay programas en ejecución.</p>
          </div>
        ) : (
          <ul className={parts.list} role="listbox" aria-label="Programas en ejecución">
            {open.map((w) => {
              const Icon = w.icon
              return (
                <li key={w.id} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={w.id === selected}
                    className={`${parts.row} ${w.id === selected ? parts.selected : ''}`}
                    onClick={() => setSelected(w.id)}
                  >
                    <Icon size={16} aria-hidden />
                    {APPS[w.appId].title}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        <div className={parts.buttons}>
          <button
            type="button"
            className={parts.btn}
            disabled={!current}
            onClick={() => {
              if (current) closeWindow(current.id)
              setSelected(null)
            }}
          >
            Finalizar tarea
          </button>
          <button type="button" className={parts.btn} onClick={() => openDialog('shutdown')}>
            Apagar...
          </button>
          <button type="button" className={parts.btn} data-autofocus onClick={closeDialog}>
            Cancelar
          </button>
        </div>
      </div>
    </SystemDialog>
  )
}
