<script>
import { createEventDispatcher } from 'svelte';
import { writable } from 'svelte/store';
import { calls, createCall } from '../../utils/danceModule';
import CallList from './CallList.svelte';
import CheckboxMarked from "svelte-material-icons/CheckboxMarked.svelte";
import CheckboxMarkedOutline from "svelte-material-icons/CheckboxMarkedOutline.svelte";

const dispatch = createEventDispatcher();

let call = writable({
  title: "",
  text: "",
  beats: 8,
  isFootwork: false,
  isHold: false,
})

let selectingFootwork = false;
let selectingHold = false;

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
  <div on:click={() => {selectingFootwork = !selectingFootwork}}>
    Footwork: {$call.footwork ? $call.footwork.title : "Select Footwork (optional)"}
  </div>
  {#if selectingFootwork}
    <button on:click={() => {
      selectingFootwork = false;
      delete $call.footwork;
    }}>
      Deselect Footwork
    </button>
    <CallList
      calls={$calls.filter(call => call.isFootwork)}
      on:selectCall={(event) => {
        selectingFootwork = false;
        let newFootwork = event.detail.call
        $call.footwork = {
          id: newFootwork.id,
          title: newFootwork.title,
          skyfeed: newFootwork.skyfeed,
          beats: $call.footwork?.beats || newFootwork.beats
        };
      }}
    />
  {/if}
  <div on:click={() => {selectingHold = !selectingHold}}>
    Hold: {$call.hold ? $call.hold.title : "Select Hold (optional)"}
  </div>
  {#if selectingHold}
    <button on:click={() => {
      selectingHold = false;
      delete $call.hold;
    }}>
      Deselect Hold
    </button>
    <CallList
      calls={$calls.filter(call => call.isHold)}
      on:selectCall={(event) => {
        selectingHold = false;
        let newHold = event.detail.call
        $call.hold = {
          id: newHold.id,
          title: newHold.title,
          skyfeed: newHold.skyfeed,
          beats: $call.hold?.beats || newHold.beats
        };
      }}
    />
  {/if}
  <div class="CreateCallToggle">
    Is this call footwork?
    <button on:click={() => {$call.isFootwork = !$call.isFootwork}}>
      {#if $call.isFootwork}
        <CheckboxMarked size="1.5rem" color="green" />
      {:else}
        <CheckboxMarkedOutline size="1.5rem" />
      {/if}
    </button>
  </div>
  <div class="CreateCallToggle">
    Is this call a hold?
    <button on:click={() => {$call.isHold = !$call.isHold}}>
      {#if $call.isHold}
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
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border: 2px black solid;
  }

  .CreateCallToggle {
    display: flex;
    gap: 0.5rem;
  }

</style>