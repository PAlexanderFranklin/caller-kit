<script>
import { getContext } from "svelte";
import MusicInfo from "../Common/Music/MusicInfo.svelte";
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";

const viewedDance = getContext("viewedDance")

</script>

<div class="DanceOptions">
  <div for="title">Name: {$viewedDance.dance.title}</div>
  {#if $viewedDance.dance.music}
  {#each $viewedDance.dance.music as music}
    <MusicInfo musicRef={music} />
  {/each}
  {/if}
  {#if $viewedDance.dance.text}
    <div for="description">Description: {$viewedDance.dance.text}</div>
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
    width: 20rem;
    background-color: white;
    border: 2px black solid;
  }
</style>