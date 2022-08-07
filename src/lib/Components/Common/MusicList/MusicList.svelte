<script>
import { createEventDispatcher } from 'svelte';
import Music from './Music.svelte';
import CreateMusic from "./CreateMusic.svelte";

export let musicList = [];
let filteredMusicList = musicList;
let filterText = "";

const dispatch = createEventDispatcher();

let hidden = true;

$: filterText, filteredMusicList = musicList.filter((music) => {
  let filter = new RegExp(filterText.toLowerCase());
  return Boolean(filterText === ""
    || music.title?.toLowerCase().match(filter)
    || music.link?.toLowerCase().match(filter)
  )
})

</script>

<div class="MusicList">
  <div>
    Search: <input type="text" bind:value={filterText} />
  </div>
  {#if hidden}
    <button on:click={() => {hidden = false}}>New Music</button>
  {:else}
    <CreateMusic on:closeModal={() => {hidden = true}} />
  {/if}
  {#each filteredMusicList as music (music.id)}
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