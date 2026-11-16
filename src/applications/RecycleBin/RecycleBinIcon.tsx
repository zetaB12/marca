import {
  RecycleBinEmpty16Icon,
  RecycleBinEmpty32Icon,
  RecycleBinFull16Icon,
  RecycleBinFull32Icon,
  type IconProps,
} from '../../components/PixelIcon/pixelIcons'
import { useRecycleStore } from '../../store/recycleStore'

/**
 * Icono de la papelera: con papeles mientras tenga elementos y vacía después de vaciarla.
 * A 32px o más usa el dibujo fino de 32×32 (como los iconos de Windows 98); en tamaños
 * pequeños, el de 16×16.
 */
export default function RecycleBinIcon({ size = 16, ...props }: IconProps) {
  const empty = useRecycleStore((s) => s.items.length === 0)
  if (size >= 32) {
    return empty ? <RecycleBinEmpty32Icon size={size} {...props} /> : <RecycleBinFull32Icon size={size} {...props} />
  }
  return empty ? <RecycleBinEmpty16Icon size={size} {...props} /> : <RecycleBinFull16Icon size={size} {...props} />
}
