<script>
import { createEventDispatcher } from "svelte";
import { createCall, updateCall, calls } from '/src/lib/utils/danceModule';
import CallList from "./CallList.svelte";
import CheckboxMarked from "svelte-material-icons/CheckboxMarked.svelte";
import CheckboxMarkedOutline from "svelte-material-icons/CheckboxMarkedOutline.svelte";

const dispatch = createEventDispatcher();

export let call = {
  title: "",
  text: "",
  beats: 8,
  isFootwork: false,
  isHold: false,
}

let selectingFootwork = false;
let selectingHold = false;

let callingModule = false;

let displayedError = null;

function handleCreateCall() {
  displayedError = null;
  callingModule = true;
  if (call.id) {
    updateCall(call).then((res) => {
      $calls = res.calls;
      dispatch('closeModal', {});
    }).catch((err) => {
      console.error(err);
      displayedError = err;
    }).finally(() => {
      callingModule = false;
    });
  }
  else {
    createCall(call).then((result) => {
      $calls = [...$calls, result.call];
      dispatch('closeModal', {});
    }).catch((err) => {
      console.error(err);
      displayedError = err;
    }).finally(() => {
      callingModule = false;
    });
  }
}

</script>

<div class="EditCall">
  <button on:click={() => {dispatch('closeModal', {})}}>X</button>
  <label for="title">Name: </label>
  <input
    id="title"
    type="text"
    bind:value={call.title}
  />
  <label for="description">Description: </label>
  <textarea
    id="description"
    bind:value={call.text}
  />
  <label for="duration">Duration in Beats: </label>
  <input
    id="duration"
    type="number"
    bind:value={call.beats}
  />
  Footwork:
  {#if call.footwork}
  <button on:click={() => {selectingFootwork = !selectingFootwork}}>
    {call.footwork.title}
  </button>
  {:else if !selectingFootwork}
  <button on:click={() => {selectingFootwork = !selectingFootwork}}>
    Select Footwork (optional)
  </button>
  {/if}
  {#if selectingFootwork}
    <button on:click={() => {
      selectingFootwork = false;
      delete call.footwork;
    }}>
      Deselect Footwork
    </button>
    <CallList
      calls={$calls.filter(call => call.isFootwork)}
      on:selectCall={(event) => {
        selectingFootwork = false;
        let newFootwork = event.detail.call
        call.footwork = {
          id: newFootwork.id,
          title: newFootwork.title,
          skyfeed: newFootwork.skyfeed,
          beats: call.footwork?.beats || newFootwork.beats
        };
      }}
    />
  {/if}
  Hold:
  {#if call.hold}
  <button on:click={() => {selectingHold = !selectingHold}}>
    {call.hold.title}
  </button>
  {:else if !selectingHold}
  <button on:click={() => {selectingHold = !selectingHold}}>
    Select Hold (optional)
  </button>
  {/if}
  {#if selectingHold}
    <button on:click={() => {
      selectingHold = false;
      delete call.hold;
    }}>
      Deselect Hold
    </button>
    <CallList
      calls={$calls.filter(call => call.isHold)}
      on:selectCall={(event) => {
        selectingHold = false;
        let newHold = event.detail.call
        call.hold = {
          id: newHold.id,
          title: newHold.title,
          skyfeed: newHold.skyfeed,
          beats: call.hold?.beats || newHold.beats
        };
      }}
    />
  {/if}
  <div class="EditCallToggle">
    Is this call footwork?
    <button on:click={() => {call.isFootwork = !call.isFootwork}}>
      {#if call.isFootwork}
        <CheckboxMarked size="1.5rem" color="green" />
      {:else}
        <CheckboxMarkedOutline size="1.5rem" />
      {/if}
    </button>
  </div>
  <div class="EditCallToggle">
    Is this call a hold?
    <button on:click={() => {call.isHold = !call.isHold}}>
      {#if call.isHold}
        <CheckboxMarked size="1.5rem" color="green" />
      {:else}
        <CheckboxMarkedOutline size="1.5rem" />
      {/if}
    </button>
  </div>
  {#if displayedError}
    <p>{displayedError}</p>
  {/if}
  {#if callingModule}
    <button>{call.id ? "Saving" : "Creating"} Call...</button>
  {:else}
    <button on:click={handleCreateCall}>{call.id ? "Save" : "Create"} Call</button>
  {/if}
</div>

<style>
  .EditCall {
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

  .EditCallToggle {
    display: flex;
    gap: 0.5rem;
  }

</style>