<script>
import { createEventDispatcher, getContext } from "svelte";
import { calls } from '/src/lib/utils/danceModule';
import CallList from "../Calls/CallList.svelte";

const dispatch = createEventDispatcher();

const newDance = getContext("newDance")

let selectingFootwork = false;
let selectingHold = false;

</script>

<div class="DanceOptions">
  <label for="title">Name: </label>
  <input
    id="title"
    type="text"
    bind:value={$newDance.dance.title}
  />
  <label for="description">Description: </label>
  <textarea
    id="description"
    bind:value={$newDance.dance.text}
  />
  <div>Duration in Beats: {$newDance.duration}</div>
  Footwork:
  {#if $newDance.dance.footwork}
  <button on:click={() => {selectingFootwork = !selectingFootwork}}>
    {$newDance.dance.footwork.title}
  </button>
  {:else if !selectingFootwork}
  <button on:click={() => {selectingFootwork = !selectingFootwork}}>
    Select Footwork (optional)
  </button>
  {/if}
  {#if selectingFootwork}
    <button on:click={() => {
      selectingFootwork = false;
      delete $newDance.dance.footwork;
    }}>
      Deselect Footwork
    </button>
    <CallList
      calls={$calls.filter(call => call.isFootwork)}
      on:selectCall={(event) => {
        selectingFootwork = false;
        let newFootwork = event.detail.call
        $newDance.dance.footwork = {
          id: newFootwork.id,
          title: newFootwork.title,
          skyfeed: newFootwork.skyfeed,
          beats: $newDance.dance.footwork?.beats || newFootwork.beats
        };
      }}
    />
  {/if}
  Hold:
  {#if $newDance.dance.hold}
  <button on:click={() => {selectingHold = !selectingHold}}>
    {$newDance.dance.hold.title}
  </button>
  {:else if !selectingHold}
  <button on:click={() => {selectingHold = !selectingHold}}>
    Select Hold (optional)
  </button>
  {/if}
  {#if selectingHold}
    <button on:click={() => {
      selectingHold = false;
      delete $newDance.dance.hold;
    }}>
      Deselect Hold
    </button>
    <CallList
      calls={$calls.filter(call => call.isHold)}
      on:selectCall={(event) => {
        selectingHold = false;
        let newHold = event.detail.call
        $newDance.dance.hold = {
          id: newHold.id,
          title: newHold.title,
          skyfeed: newHold.skyfeed,
          beats: $newDance.dance.hold?.beats || newHold.beats
        };
      }}
    />
  {/if}
  <button on:click={() => {dispatch("createDance")}}>{$newDance.dance.id ? "Save" : "Create"}</button>
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