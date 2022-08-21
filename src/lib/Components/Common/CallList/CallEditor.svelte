<script>
import { createEventDispatcher, getContext } from "svelte";
import { getCallByRef, createCall, updateCall, calls } from '/src/lib/utils/danceModule';
import CallList from "./CallList.svelte";
import CheckboxMarked from "svelte-material-icons/CheckboxMarked.svelte";
import CheckboxMarkedOutline from "svelte-material-icons/CheckboxMarkedOutline.svelte";

export let call = {
  title: "",
  text: "",
  beats: 8,
  isFootwork: false,
  isHold: false,
}

const dispatch = createEventDispatcher();
const openModal = getContext("openModal");

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

async function updateDependencies() {
  openModal(
    async () => {
      let footworkPromise = null;
      if (call.footwork) {
        footworkPromise = getCallByRef({id: call.footwork.id});
      }
      let holdPromise = null;
      if (call.hold) {
        holdPromise = getCallByRef({id: call.hold.id});
      }
      const footworkResponse = await footworkPromise;
      if (footworkResponse) {
        call.footwork = {
          id: footworkResponse.call.id,
          title: footworkResponse.call.title,
          skyfeed: footworkResponse.call.skyfeed,
        };
      }
      const holdResponse = await holdPromise;
      if (holdResponse) {
        call.hold = {
          id: holdResponse.call.id,
          title: holdResponse.call.title,
          skyfeed: holdResponse.call.skyfeed,
        };
      }
    },
    async () => {},
    {
      action: "update",
      acting: "updating",
      text: `
        Are you sure you want to update the footwork and hold references on this call?
        This will replace them with the version in your personal module storage if you have one. You will still need to save the call for the changes to take effect.
      `,
      item: null,
      confirmColor: "blue",
    }
  );
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
    {#if call.footwork || call.hold}
      <button on:click={updateDependencies} class="UpdateDependencies">Update Dependencies</button>
    {/if}
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
  #description {
    height: 5rem;
  }

  .EditCallToggle {
    display: flex;
    gap: 0.5rem;
  }
  .UpdateDependencies {
    margin: 1rem 0rem;
  }

</style>