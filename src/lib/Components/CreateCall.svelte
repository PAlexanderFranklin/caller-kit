<script>
import { createEventDispatcher } from 'svelte';
import { writable } from 'svelte/store';
import { createCall } from '../utils/danceModule';

const dispatch = createEventDispatcher();

let call = writable({
  title: "",
  text: "",
  duration: 8
})

let creating = false;

function handleCreateCall() {
  creating = true;
  createCall($call).then(() => {
    $call = {};
    dispatch('closeModal', {});
    creating = false;
  }).catch((err) => {
    console.error(err);
    creating = false;
  });
}
</script>

<div class="CreateCall">
  <label for="title">Name: </label>
  <input
    id="title"
    type="text"
    bind:value={$call.title}
  />
  <label for="description">Description: </label>
  <textarea
    id="description"
    bind:value={$call.text}
  />
  <label for="duration">Duration in Beats: </label>
  <input
    id="duration"
    type="number"
    bind:value={$call.beats}
  />
  {#if creating}
    <button>Creating Call...</button>
  {:else}
    <button on:click={handleCreateCall}>Create Call</button>
  {/if}
</div>

<style>
  .CreateCall {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 20rem;
  }
</style>