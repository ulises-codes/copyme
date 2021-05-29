<script context="module" lang="ts">
  import { playSound, stopSound } from '../util/Audio.svelte'

  import { activePad, isDemonstrating } from 'src/util/store'

  export function demonstrate(padPosition?: number): void {
    const duration = 600

    activePad.update(() => padPosition)

    if (padPosition !== undefined) {
      playSound(padPosition)
    }

    stopSound(0.5)

    setTimeout(() => {
      activePad.set(undefined)
    }, duration)

    if (padPosition === undefined) {
      isDemonstrating.set(false)
    }
  }

  export function getMusicalNote(activePad: number) {
    const semitones =
      activePad === 1 ? 4 : activePad === 2 ? 7 : activePad === 3 ? 9 : 0

    return 440 * Math.pow(Math.pow(2, 1 / 12), semitones)
  }
</script>
