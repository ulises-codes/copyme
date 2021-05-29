<script lang="ts">
  import { isPlaying, score } from './util/store'

  export let startGame: () => void
</script>

<button class="screen" on:click={startGame}>
  {#if !$isPlaying}
    <span>START</span>
  {:else}
    <span class="score">{$score}</span>
  {/if}
</button>

<style>
  .screen {
    position: absolute;
    cursor: pointer;
    background-color: #0033ff;
    border: 8px solid #171717;
    align-self: center;
    justify-self: center;
    height: 150px;
    width: 150px;
    z-index: 99;
    border-radius: 50%;
    box-shadow: inset 0 0 0 8px black;
    user-select: none;
  }

  .score {
    font-size: 2rem;
  }
</style>
