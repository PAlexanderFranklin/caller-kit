<script>
import { createEventDispatcher, getContext } from "svelte";
import { calls, getCallByRef, insertCall, updateCall } from '/src/lib/utils/danceModule';
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";
import Download from "svelte-material-icons/Download.svelte";

const dispatch = createEventDispatcher();

const viewedDance = getContext("viewedDance");
const openModal = getContext("openModal");

let checkCall = {};
let selectedCall = {};
let sourceCall = {};
let getting = false;
let getError = false;

$: {
  try {
    checkCall = $viewedDance.dance.instructions[$viewedDance.selection.group][$viewedDance.selection.call];
  }
  catch {}
  selectedCall = checkCall ? checkCall : {};
}

async function getCall() {
  getting = true;
  getError = false;
  if (selectedCall.id) {
    try {
      const res = await getCallByRef(selectedCall);
      if (res.call) {
        sourceCall = res.call;
      }
    }
    catch (err) {
      console.error(err);
      sourceCall = {}
      getError = true;
    }
  }
  getting = false;
}
$: selectedCall, getCall();

async function handleSaveCall() {
  let userCall;
  try {
    const res = await getCallByRef({id: sourceCall.id});
    userCall = res.call;
  } catch (error) {
    userCall = null;
  }
  if (userCall) {
    openModal(
      async () => {
        const res = await updateCall(sourceCall);
        $calls = res.calls;
        return res;
      },
      async () => {},
      {
        action: "overwrite",
        acting: "overwriting",
        text: "A call with the same id was found in your personal storage! \n If you save this call, it will overwrite the version in your personal storage, are you sure you want to do that?",
        item: `Title: New: ${sourceCall.title}, Old: ${userCall.title} \n Id: ${sourceCall.id}`,
        confirmColor: "red",
      }
    );
  }
  else {
    openModal(
      async () => {
        const res = await insertCall(sourceCall);
        $calls = res.calls;
        return res;
      },
      async () => {},
      {
        action: "save",
        acting: "saving",
        text: "Are you sure you want to save this call to your personal module storage? None of its dependencies will be saved, you will have to save them separately if you want to avoid losing them.",
        item: sourceCall.title,
        confirmColor: "blue",
      }
    );
  }
}

function removeCall(groupIndex, callIndex) {
  dispatch('removeCall', {groupIndex: groupIndex, callIndex: callIndex});
}

</script>

<div class="sectionLabel">Call</div>
<div class="SelectedCall">
  {#if Object.keys(selectedCall).length !== 0}
    {#if !$viewedDance.selection.delay}
      <h4>Name: {selectedCall.title || "N/A"}</h4>
      {#if getError}
        <p>
          This call failed to fetch any information. This could be because
          either your internet or Skynet is not working properly, but it
          could also be because the call it references has been deleted.
          If the latter is the case, you should replace this call on this
          dance.
        </p>
      {:else if sourceCall && sourceCall.skyfeed}
        <button on:click={handleSaveCall}><Download color={"blue"} /></button>
      {/if}
      {#if $viewedDance.editing}
        <label for="beatsInDelay">Delay in Beats: </label>
        <input
          id="beatsInDelay"
          type="number"
          bind:value={selectedCall.delay}
          on:keyup={() => {$viewedDance.duration = $viewedDance.duration}}
        />
        <label for="beatsInSelection">Duration in Beats: </label>
        <input
          id="beatsInSelection"
          type="number"
          bind:value={selectedCall.beats}
          on:keyup={() => {
            if (selectedCall.beats) {
              $viewedDance.duration = $viewedDance.duration;
            }
          }}
        />
      {:else}
        {#if selectedCall.delay}
        <div>Delay in Beats: {selectedCall.delay}</div>
        {/if}
        {#if !$viewedDance.selection.delay}
          <div>Duration in Beats: {selectedCall.beats}</div>
        {/if}
      {/if}
      <p>Description: {getting ? "Loading..." : sourceCall?.text || ""}</p>
      <Dependencies source={sourceCall} />
      {#if $viewedDance.editing}
        <button on:click={() => {removeCall($viewedDance.selection.group, $viewedDance.selection.call)}} class="RemoveButton">Remove</button>
      {/if}
    {:else}
      <label for="beatsInDelay">Delay in Beats: </label>
      <input
        id="beatsInDelay"
        type="number"
        bind:value={selectedCall.delay}
        on:keyup={() => {$viewedDance.duration = $viewedDance.duration}}
      />
    {/if}
  {:else}
    No Call Selected
  {/if}
</div>

<style>
  .SelectedCall {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 2rem;
    width: 20rem;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
  h4 {
    margin: 0rem;
  }
  .sectionLabel {
    padding: 0.5rem 5rem;
    background-color: lightgrey;
    border: 2px solid black;
    font-weight: 500;
  }
  .RemoveButton {
    margin-top: 1rem;
  }
</style>