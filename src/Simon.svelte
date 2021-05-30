<script lang="ts">
  import { demonstrate, setBestScore } from './lib/helper.svelte'
  import Pad from './Pad.svelte'
  import Screen from './Screen.svelte'
  import GameWorkerURL from 'omt:./util/worker.ts'

  import { isDemonstrating, score, isPlaying, activePad } from './util/store'
  import { onDestroy } from 'svelte'
  import './util/Audio.svelte'

  function handleMessage(
    e: MessageEvent<{ action: 'demonstrate'; payload: number }>
  ): void
  function handleMessage(
    e: MessageEvent<{ action: 'game_over' | 'score' }>
  ): void
  function handleMessage(
    e: MessageEvent<{
      action: 'demonstrate' | 'game_over' | 'score'
      payload?: number
    }>
  ) {
    switch (e.data.action) {
      case 'demonstrate':
        isDemonstrating.set(true)
        demonstrate(e.data.payload, 600 - $score * 20)

        break

      case 'game_over':
        isPlaying.set(false)
        activePad.set(undefined)

        break

      case 'score':
        score.update(value => {
          const newScore = value + 1

          setBestScore(newScore)
          return newScore
        })

        break
    }
  }

  const gameWorker = new Worker(`./build/${GameWorkerURL}`, {
    type: 'module',
    name: 'game-worker',
  })

  gameWorker.onmessage = handleMessage

  const startGame = () => {
    if ($isPlaying) return

    score.set(0)
    isPlaying.set(true)

    gameWorker.postMessage({ action: 'start' })
  }

  const play = (padPosition: number) => {
    if (!$isPlaying || $isDemonstrating) return

    gameWorker.postMessage({ action: 'play', payload: padPosition })
  }

  onDestroy(() => {
    gameWorker.terminate()
  })
</script>

<div class="game-root">
  <div class="game-wrapper">
    {#each ['green', 'red', 'yellow', 'blue'] as padColor, i}
      <Pad {padColor} padPosition={i} {play} />
    {/each}
    <Screen {startGame} />
  </div>
</div>

<style>
  .game-root {
    --black: #202020;
    --gap: 16px;
    --green: green;
    --red: red;
    --yellow: yellow;
    --blue: blue;
    --dark-black: #171717;

    max-width: 540px;
    max-height: 540px;
    height: 90vw;
    width: 90vw;
    background-color: var(--black);
    border-radius: 50%;
    margin: auto;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--gap);
    box-shadow: 0 0 0 4px var(--black);
    border: 4px solid #171717;
  }

  .game-wrapper {
    display: grid;
    gap: var(--gap);
    grid-template: repeat(2, 1fr) / repeat(2, 1fr);
    border-radius: 50%;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
