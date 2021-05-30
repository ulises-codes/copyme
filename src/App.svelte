<script lang="ts">
  import { onMount } from 'svelte'
  import { getBestScore } from './lib/helper.svelte'

  import Simon from './Simon.svelte'
  import { bestScore } from './util/store'

  onMount(() => {
    const savedScore = getBestScore()

    // bestScore.set(parseInt(savedScore) ?? 0)
  })
</script>

<main>
  <Simon />
</main>
<footer>
  <small>
    <span>©{new Date().getFullYear()} |</span>
    <a href="https://ulises.codes" target="_blank" rel="noopener">
      Ulises Himely
    </a>
  </small>
</footer>
