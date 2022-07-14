<script>
import { createEventDispatcher, getContext } from "svelte";
import { calls } from '/src/lib/utils/danceModule';
import CallList from "/src/lib/Components/Common/CallList/CallList.svelte";

const dispatch = createEventDispatcher();

const viewedDance = getContext("viewedDance")

let selectingFootwork = false;
let selectingHold = false;

</script>

<div class="DanceOptions">
  <label for="title">Name: </label>
  <input
    id="title"
    type="text"
    bind:value={$viewedDance.dance.title}
  />
  <label for="description">Description: </label>
  <textarea
    id="description"
    bind:value={$viewedDance.dance.text}
  />
  <div>Duration in Beats: {$viewedDance.duration}</div>
  Footwork:
  {#if $viewedDance.dance.footwork}
  <button on:click={() => {selectingFootwork = !selectingFootwork}}>
    {$viewedDance.dance.footwork.title}
  </button>
  {:else if !selectingFootwork}
  <button on:click={() => {selectingFootwork = !selectingFootwork}}>
    Select Footwork (optional)
  </button>
  {/if}
  {#if selectingFootwork}
    <button on:click={() => {
      selectingFootwork = false;
      delete $viewedDance.dance.footwork;
    }}>
      Deselect Footwork
    </button>
    <CallList
      calls={$calls.filter(call => call.isFootwork)}
      on:selectCall={(event) => {
        selectingFootwork = false;
        let newFootwork = event.detail.call
        $viewedDance.dance.footwork = {
          id: newFootwork.id,
          title: newFootwork.title,
          skyfeed: newFootwork.skyfeed,
          beats: $viewedDance.dance.footwork?.beats || newFootwork.beats
        };
      }}
    />
  {/if}
  Hold:
  {#if $viewedDance.dance.hold}
  <button on:click={() => {selectingHold = !selectingHold}}>
    {$viewedDance.dance.hold.title}
  </button>
  {:else if !selectingHold}
  <button on:click={() => {selectingHold = !selectingHold}}>
    Select Hold (optional)
  </button>
  {/if}
  {#if selectingHold}
    <button on:click={() => {
      selectingHold = false;
      delete $viewedDance.dance.hold;
    }}>
      Deselect Hold
    </button>
    <CallList
      calls={$calls.filter(call => call.isHold)}
      on:selectCall={(event) => {
        selectingHold = false;
        let newHold = event.detail.call
        $viewedDance.dance.hold = {
          id: newHold.id,
          title: newHold.title,
          skyfeed: newHold.skyfeed,
          beats: $viewedDance.dance.hold?.beats || newHold.beats
        };
      }}
    />
  {/if}
  {#if $viewedDance.saving}
    <button>{$viewedDance.dance.id ? "Saving" : "Creating"} Dance...</button>
  {:else}
  <button on:click={() => {dispatch("createDance")}}>{$viewedDance.dance.id ? "Save" : "Create"} Dance</button>
  {/if}
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