<script>
import { getContext } from "svelte";

const viewedDance = getContext("viewedDance")

</script>

<div class="DanceOptions">
  <div for="title">Name: {$viewedDance.dance.title}</div>
  <div for="description">Description: {$viewedDance.dance.text}</div>
  <div>Duration in Beats: {$viewedDance.duration}</div>
  Footwork:
  <!-- {#if $viewedDance.dance.footwork}
  <button on:click={() => {selectingFootwork = !selectingFootwork}}>
    {$viewedDance.dance.footwork.title}
  </button>
  {/if}
  Hold:
  {#if $viewedDance.dance.hold}
  <button on:click={() => {selectingHold = !selectingHold}}>
    {$viewedDance.dance.hold.title}
  </button>
  {/if} -->
</div>

<style>
  .DanceOptions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 20rem;
    background-color: white;
    border: 2px black solid;
  }
</style>