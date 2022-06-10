<script>
import { writable } from "svelte/store";

let call = writable({
  title: "",
  text: "",
  duration: 8
})
</script>

<div class="CreateCall">
  <label for="title">Title: </label>
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
    bind:value={$call.duration}
  />
  <button on:click={() => {console.log($call)}}>Create Call</button>
</div>

<style>
  .CreateCall {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 20rem;
  }
</style>