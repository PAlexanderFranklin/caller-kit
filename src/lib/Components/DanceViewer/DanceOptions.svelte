<script>
import { getContext } from "svelte";
import MusicInfo from "/src/lib/Components/Common/Music/MusicInfo.svelte";
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";

const viewedDance = getContext("viewedDance")

</script>

<div class="sectionLabel">Dance</div>
<div class="DanceOptions">
  <h3>Title: {$viewedDance.dance.title}</h3>
  {#if $viewedDance.dance.music}
  {#each $viewedDance.dance.music as music}
    <MusicInfo musicRef={music} />
  {/each}
  {/if}
  {#if $viewedDance.dance.text}
    <div>Description: {$viewedDance.dance.text}</div>
  {/if}
  <div>Duration in Beats: {$viewedDance.duration}</div>
  <Dependencies source={$viewedDance.dance} />
</div>

<style>
  .DanceOptions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border: 2px black solid;
  }
  .sectionLabel {
    padding: 0.5rem 5rem;
    background-color: lightgrey;
    border: 2px solid black;
    font-weight: 500;
  }
</style>