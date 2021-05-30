<script context="module" lang="ts">
  import { playSound } from '../util/Audio.svelte'

  import { activePad, isDemonstrating } from 'src/util/store'

  export function getBestScore() {
    const bestScore = localStorage.getItem('bestScore')

    return bestScore
  }

  export function setBestScore(newScore: number) {
    const currentBestScore = getBestScore() ?? 0

    if (newScore > currentBestScore) {
      localStorage.setItem('bestScore', newScore.toString())
    }
  }

  export function demonstrate(padPosition?: number, duration = 600): void {
    activePad.update(() => padPosition)

    if (padPosition !== undefined) {
      playSound(padPosition)
    }

    setTimeout(() => {
      activePad.set(undefined)
    }, duration)

    if (padPosition === undefined) {
      isDemonstrating.set(false)
    }
  }
</script>
