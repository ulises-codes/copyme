<script lang="ts">
  import { spring } from 'svelte/motion'
  import { playSound, stopSound } from './util/Audio.svelte'
  import { activePad, isDemonstrating } from './util/store'

  export let padColor: string
  export let padPosition: number

  export let play: (padPosition: number) => void

  $: isPressed = $activePad === padPosition

  let padSize = spring(1, {
    stiffness: 0.2,
    damping: 0.25,
  })

  $: opacity = isPressed ? 1 : 0.5
  $: {
    if (isPressed) {
      padSize.set(0.95)
    } else {
      padSize.set(1)
    }
  }

  //* Flip pads based on their index and convert to CSS variables
  //* Should look like:
  // [[1, 1], [-1, 1],
  //[1, -1], [1, -1]]
  const flipValues = [padPosition % 2 === 0 ? 1 : -1, padPosition < 2 ? 1 : -1]
    .map((value, i) => `--scale-${i === 0 ? 'x' : 'y'}:${value}`)
    .join(';')

  const deactivatePad = () => {
    if (!$isDemonstrating && isPressed) {
      activePad.set(undefined)

      stopSound()
    }
  }

  const handlePress = () => {
    if ($isDemonstrating) return

    activePad.set(padPosition)

    playSound(padPosition)
  }
</script>

<svg
  class="pad {padColor}"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-4 -4 218 222"
  style="--pad-color:{padColor};{flipValues}"
>
  <defs />
  <path
    d="M184.2,120.6l25.2-109.5c0-6.7-6.3-7.9-12.9-9.3C149.3-8.1,94.1,23.2,58.9,58C23.2,93.4-4.4,143.5,0.6,196.9
  c0.6,6.7,2.5,13,9.2,13l109.3-23c2.9-0.9,5.3-2.7,7.1-5.2l16.5-24.2c3.3-4.7,9.8-11.2,14.6-14.5l21.8-15.3
  C181.5,125.9,183.3,123.4,184.2,120.6z"
  />
  <path
    class="pad-path"
    on:click|preventDefault={() => play(padPosition)}
    on:mousedown|preventDefault={handlePress}
    on:mouseup|preventDefault={deactivatePad}
    on:mouseout|preventDefault={deactivatePad}
    style="transform:scale({$isDemonstrating
      ? 1
      : $padSize});opacity:{opacity};filter:drop-shadow(2px 2px 0 var(--pad-color)) var(--light-shadow)
    {isPressed ? 'drop-shadow(0px 0px 2px var(--pad-color))' : ''}"
    d="M184.2,120.6l25.2-109.5c0-6.7-6.3-7.9-12.9-9.3C149.3-8.1,94.1,23.2,58.9,58C23.2,93.4-4.4,143.5,0.6,196.9
	c0.6,6.7,2.5,13,9.2,13l109.3-23c2.9-0.9,5.3-2.7,7.1-5.2l16.5-24.2c3.3-4.7,9.8-11.2,14.6-14.5l21.8-15.3
	C181.5,125.9,183.3,123.4,184.2,120.6z"
  />
</svg>

<style>
  .pad {
    --pad-shadow: drop-shadow(4px 4px 0 var(--dark-black));
    --light-shadow: drop-shadow(4px 4px 0 #2323230f);
    align-self: center;
    justify-self: center;
    height: 100%;
    width: 100%;
    transform: scale(var(--scale-x), var(--scale-y));
    filter: drop-shadow(0 0 0 var(--black));
    stroke: var(--dark-black);
    stroke-width: 4px;
    filter: drop-shadow(2px 4px 0px var(--dark-black));
  }

  .pad-path {
    stroke: #171717;
    stroke-width: 2px;
    fill: var(--pad-color);
    cursor: pointer;
    overflow: hidden;
    transform-origin: center;
  }
</style>
