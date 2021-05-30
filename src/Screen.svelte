<script lang="ts">
  import { getBestScore } from './lib/helper.svelte'

  import { isPlaying, score, isDemonstrating } from './util/store'

  export let startGame: () => void

  $: backgroundColor =
    !$isPlaying && $score > 0
      ? '#802C33'
      : $isDemonstrating
      ? '#000D40'
      : '#263880'
</script>

<button
  class="screen"
  on:click={startGame}
  style="--background-color:{backgroundColor}"
  disabled={$isDemonstrating}
>
  <span>
    {#if !$isPlaying && $score > 0}
      <span class="results">
        <span>Score: {$score}</span>
        <span>Best: {getBestScore()}</span>
      </span>
    {:else if !$isPlaying}
      GO
    {:else}
      {$score}
    {/if}
  </span>
</button>

<style>
  button {
    color: inherit;
    position: absolute;
    cursor: pointer;
    background-color: var(--background-color);
    border: 8px solid black;
    align-self: center;
    justify-self: center;
    height: 28vw;
    width: 28vw;
    max-height: 176px;
    max-width: 176px;
    z-index: 99;
    border-radius: 50%;
    box-shadow: 0 0 0 8px #171717;
    user-select: none;
    font-size: min(38px, 4.5vw);
    margin: 0;
  }

  button:active {
    background-color: #3d5acc;
  }

  .results {
    font-size: min(30px, 4vw);
  }
</style>
