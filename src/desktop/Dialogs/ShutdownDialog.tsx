import { useState } from 'react'
import { PowerIcon } from '../../components/PixelIcon/pixelIcons'
import SystemDialog from '../../components/SystemDialog/SystemDialog'
import parts from '../../components/SystemDialog/dialogParts.module.css'
import { useDesktopStore } from '../../store/desktopStore'
import { useWindowStore } from '../../store/windowStore'

type Choice = 'restart' | 'close'

/** "Shut Down": como no se puede apagar un sitio web, ofrece acciones reales sobre el escritorio. */
export default function ShutdownDialog() {
  const closeDialog = useDesktopStore((s) => s.closeDialog)
  const restart = useDesktopStore((s) => s.restart)
  const closeAll = useWindowStore((s) => s.closeAll)
  const [choice, setChoice] = useState<Choice>('restart')

  const confirm = () => {
    if (choice === 'restart') restart()
    else {
      closeAll()
      closeDialog()
    }
  }

  return (
    <SystemDialog title="Shut Down" icon={<PowerIcon size={16} />} onClose={closeDialog}>
      <div className={parts.body}>
        <p className={parts.question}>What do you want the computer to do?</p>
        <fieldset className={parts.options}>
          <legend className="sr-only">Shut down options</legend>
          <label className={parts.option}>
            <input
              type="radio"
              name="shutdown"
              data-autofocus
              checked={choice === 'restart'}
              onChange={() => setChoice('restart')}
            />
            Restart the desktop
          </label>
          <label className={parts.option}>
            <input type="radio" name="shutdown" checked={choice === 'close'} onChange={() => setChoice('close')} />
            Close all programs
          </label>
        </fieldset>
        <div className={parts.buttons}>
          <button type="button" className={parts.btn} onClick={confirm}>
            OK
          </button>
          <button type="button" className={parts.btn} onClick={closeDialog}>
            Cancel
          </button>
        </div>
      </div>
    </SystemDialog>
  )
}
