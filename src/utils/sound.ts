import { useSettingsStore } from '../store/settingsStore'

export type Sound = 'open' | 'close' | 'tick' | 'ding'

interface Note {
  freq: number
  duration: number
  type: OscillatorType
}

/** Sonidos sintetizados con Web Audio (sin archivos). Tonos cortos al estilo de Windows 98. */
const SOUNDS: Record<Sound, Note[]> = {
  open: [
    { freq: 523, duration: 0.07, type: 'square' },
    { freq: 784, duration: 0.13, type: 'square' },
  ],
  close: [
    { freq: 659, duration: 0.07, type: 'square' },
    { freq: 392, duration: 0.13, type: 'square' },
  ],
  tick: [{ freq: 1100, duration: 0.03, type: 'square' }],
  ding: [{ freq: 880, duration: 0.2, type: 'triangle' }],
}

const MAX_GAIN = 0.16
let context: AudioContext | null = null

function getContext(): AudioContext | null {
  if (context) return context
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  context = new Ctor()
  return context
}

/** Reproduce un sonido respetando volumen y silencio. Solo suena tras una interacción del usuario. */
export function playSound(kind: Sound) {
  try {
    const { volume, muted } = useSettingsStore.getState()
    if (muted || volume <= 0 || typeof window === 'undefined') return
    // Los navegadores bloquean el audio hasta que el usuario interactúa con la página.
    if (!navigator.userActivation?.hasBeenActive) return
    const ctx = getContext()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()

    const peak = MAX_GAIN * (volume / 100)
    let start = ctx.currentTime
    for (const note of SOUNDS[kind]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = note.type
      osc.frequency.value = note.freq
      gain.gain.setValueAtTime(peak, start)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + note.duration)
      start += note.duration
    }
  } catch {
    // El audio es opcional: nunca debe romper la interfaz.
  }
}
