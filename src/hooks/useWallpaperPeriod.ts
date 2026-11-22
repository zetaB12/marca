import { useSettingsStore } from '../store/settingsStore'
import { useDayPeriod, type DayPeriod } from './useDayPeriod'

/** Período que se ve ahora: el de la hora de Lima, o el fijado a mano en Ajustes. */
export function useWallpaperPeriod(): DayPeriod {
  const mode = useSettingsStore((s) => s.wallpaperMode)
  const auto = useDayPeriod()
  return mode === 'auto' ? auto : mode
}
