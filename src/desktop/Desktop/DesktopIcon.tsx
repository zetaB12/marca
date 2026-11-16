import { APPS, type WindowAppId } from '../../data/apps'
import { useUiScale } from '../../hooks/useUiScale'
import { useDesktopStore } from '../../store/desktopStore'
import styles from './DesktopIcon.module.css'

export default function DesktopIcon({ id }: { id: WindowAppId }) {
  const { file, icon: Icon } = APPS[id]
  const { selectedIcon, selectIcon, launch, openContextMenu } = useDesktopStore()
  const selected = selectedIcon === id
  // El icono pixel art crece en múltiplos de 16 px (siempre nítido): 48, 64, 80.
  const iconSize = Math.max(48, Math.round((48 * useUiScale()) / 16) * 16)

  const onClick = (e: React.MouseEvent) => {
    // Teclado (detail 0) y touch: abren de inmediato. Ratón: un clic selecciona, doble clic abre.
    if (e.detail === 0 || window.matchMedia('(pointer: coarse)').matches) launch(id)
    else selectIcon(id)
  }

  return (
    <button
      type="button"
      className={`${styles.icon} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      onDoubleClick={() => launch(id)}
      onFocus={() => selectIcon(id)}
      onContextMenu={
        id === 'mycomputer'
          ? (e) => {
              e.preventDefault()
              e.stopPropagation()
              selectIcon(id)
              openContextMenu(e.clientX, e.clientY, 'mycomputer')
            }
          : undefined
      }
      aria-label={`Open ${file}`}
    >
      <span className={styles.glyph}>
        <Icon size={iconSize} aria-hidden />
      </span>
      <span className={styles.label}>{file}</span>
    </button>
  )
}
