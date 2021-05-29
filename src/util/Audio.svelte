<script context="module" lang="ts">
  import { getMusicalNote } from '../lib/helper.svelte'

  const audioCtx = new AudioContext()

  const gainNode = audioCtx.createGain()

  gainNode.connect(audioCtx.destination)

  let oscillator: OscillatorNode

  export function playSound(activePad: number, duration: number = 0.4) {
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime)

    const note = getMusicalNote(activePad)

    oscillator = audioCtx.createOscillator()
    oscillator.type = 'sawtooth'

    oscillator.connect(gainNode)

    gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.01)
    oscillator.frequency.setValueAtTime(note, audioCtx.currentTime)

    oscillator.start()

    stopSound()
  }

  export function stopSound(
    releaseTime: number = 0.05,
    releaseDuration: number = 0.05
  ) {
    if (oscillator) {
      gainNode.gain.setValueCurveAtTime(
        [gainNode.gain.value, 0.1, 0.05, 0.03, 0.001],
        audioCtx.currentTime + releaseTime,
        releaseDuration
      )
      //   gainNode.gain.exponentialRampToValueAtTime(
      //     0.01,
      //     audioCtx.currentTime + time
      //   )

      oscillator.stop(
        audioCtx.currentTime + releaseDuration + releaseTime + 0.01
      )
    }
  }
</script>
