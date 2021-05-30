<script context="module" lang="ts">
  interface SynthProps {
    type: OscillatorNode['type']
    pitchOffset?: number
  }

  const MAX_VOLUME = 0.3

  const audioCtx = new AudioContext()

  const gainNode = audioCtx.createGain()

  gainNode.connect(audioCtx.destination)

  gainNode.gain.setValueAtTime(audioCtx.currentTime, MAX_VOLUME)

  const synths: SynthProps[] = [
    { type: 'triangle' },
    { type: 'sawtooth' },
    { type: 'triangle', pitchOffset: 12 },
    { type: 'sawtooth' },
  ]
  let oscillators: OscillatorNode[] = []

  function connectSynth({ type, pitchOffset }: SynthProps, activePad: number) {
    const note = getMusicalNote(activePad, pitchOffset)

    const oscillator = audioCtx.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(note, audioCtx.currentTime)
    oscillator.connect(gainNode)

    oscillators.push(oscillator)
  }

  export function playSound(activePad: number) {
    oscillators = []
    synths.forEach(synth => connectSynth(synth, activePad))

    console.log(gainNode.gain.value)

    gainNode.gain.cancelScheduledValues(audioCtx.currentTime)

    gainNode.gain.linearRampToValueAtTime(
      MAX_VOLUME,
      audioCtx.currentTime + 0.05
    )

    oscillators.forEach(oscillator => oscillator.start())

    stopSound()
  }

  export function stopSound(
    releaseTime: number = 0.05,
    releaseDuration: number = 0.17
  ) {
    if (oscillators.length > 0) {
      gainNode.gain.setValueCurveAtTime(
        [Math.min(MAX_VOLUME, gainNode.gain.value), 0.05, 0.001],
        audioCtx.currentTime + releaseTime,
        releaseDuration
      )

      oscillators.forEach(oscillator =>
        oscillator.stop(
          audioCtx.currentTime + releaseDuration + releaseTime + 0.02
        )
      )
    }
  }

  function getMusicalNote(activePad: number, offset?: number) {
    const semitones =
      activePad === 1 ? 4 : activePad === 2 ? 7 : activePad === 3 ? 9 : 0

    return 440 * Math.pow(Math.pow(2, 1 / 12), semitones + (offset ?? 0))
  }
</script>
