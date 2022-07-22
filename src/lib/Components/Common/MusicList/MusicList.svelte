<script>
import { createEventDispatcher } from 'svelte';
import Music from './Music.svelte';
import CreateMusic from "./CreateMusic.svelte";

export let musicList = [];

const dispatch = createEventDispatcher();

let hidden = true;
</script>

<div class="MusicList">
  {#if hidden}
    <button on:click={() => {hidden = false}}>New Music</button>
  {:else}
    <CreateMusic on:closeModal={() => {hidden = true}} />
  {/if}
  {#each musicList as music (music.id)}
      <Music music={music} on:selectMusic={() => {dispatch('selectMusic', { music })}} />
  {/each}
</div>

<style>
  .MusicList {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 3rem;
    min-width: 20rem;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
</style>