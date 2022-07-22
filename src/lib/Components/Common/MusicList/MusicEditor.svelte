<script>
import { createEventDispatcher, getContext } from "svelte";

const dispatch = createEventDispatcher();

export let verb = "Creat";
const music = getContext("music");

const callingModule = getContext("callingModule");

</script>

<div class="EditMusic">
  <button on:click={() => {dispatch('closeModal', {})}}>X</button>
  <label for="title">Name: </label>
  <input
    id="title"
    type="text"
    bind:value={$music.title}
  />
  <label for="link">Link: </label>
  <textarea
    id="link"
    bind:value={$music.link}
  />
  {#if $callingModule}
    <button>{verb}ing Music...</button>
  {:else}
    <button on:click={() => {dispatch("callModule")}}>{verb}e Music</button>
  {/if}
</div>

<style>
  .EditMusic {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 20rem;
    background-color: white;
    border: 2px black solid;
  }
</style>