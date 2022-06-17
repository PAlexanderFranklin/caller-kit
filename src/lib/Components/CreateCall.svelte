<script>
import { writable } from 'svelte/store';
import { createCall } from '../utils/danceModule';

let call = writable({
  title: "",
  text: "",
  duration: 8
})

function handleCreateCall() {
  createCall($call).then(() => {
    $call = {};
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
  <button on:click={handleCreateCall}>Create Call</button>
</div>

<style>
  .CreateCall {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 20rem;
  }
</style>