<script>
import { createEventDispatcher } from 'svelte';
import { writable } from 'svelte/store';
import { createCall } from '../../utils/danceModule';
import CallList from './CallList.svelte';
import CheckboxMarked from "svelte-material-icons/CheckboxMarked.svelte";
import CheckboxMarkedOutline from "svelte-material-icons/CheckboxMarkedOutline.svelte";

const dispatch = createEventDispatcher();

let call = writable({
  title: "",
  text: "",
  duration: 8,
  isFootwork: false,
  isHold: false,
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
  <button on:click={() => {dispatch('closeModal', {})}}>X</button>
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
  <CallList />
  <div class="CreateCallToggle">
    This call is footwork:
    <button on:click={() => {call.isFootwork = !call.isFootwork}}>
      {#if call.isFootwork}
        <CheckboxMarked size="1.5rem" color="green" />
      {:else}
        <CheckboxMarkedOutline size="1.5rem" />
      {/if}
    </button>
  </div>
  <div class="CreateCallToggle">
    This call is a hold:
    <button on:click={() => {call.isHold = !call.isHold}}>
      {#if call.isHold}
        <CheckboxMarked size="1.5rem" color="green" />
      {:else}
        <CheckboxMarkedOutline size="1.5rem" />
      {/if}
    </button>
  </div>
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

  .CreateCallToggle {
    display: flex;
    gap: 0.5rem;
  }

</style>