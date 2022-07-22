<script>
import { createEventDispatcher, getContext } from "svelte";
import { getCallByRef } from '/src/lib/utils/danceModule';
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";

const dispatch = createEventDispatcher();

const viewedDance = getContext("viewedDance");

let checkCall = {};
let selectedCall = {};
let sourceCall = {};
let getting = false;

$: {
  try {
    checkCall = $viewedDance.dance.instructions[$viewedDance.selection.group][$viewedDance.selection.call];
  }
  catch {}
  selectedCall = checkCall ? checkCall : {};
}

async function getCall() {
  getting = true;
  if (selectedCall.id) {
    try {
      const res = await getCallByRef(selectedCall);
      if (res.call) {
        sourceCall = res.call;
      }
    }
    catch (err) {
      console.log(err);
      sourceCall = {}
    }
  }
  getting = false;
}
$: selectedCall, getCall();

function removeCall(groupIndex, callIndex) {
  dispatch('removeCall', {groupIndex: groupIndex, callIndex: callIndex});
}

</script>

<div class="SelectedCall">
  {#if Object.keys(selectedCall).length !== 0}
    <h4>Name: {selectedCall.title || "N/A"}</h4>
    <label for="beatsInDelay">Delay in Beats: </label>
    <input
      id="beatsInDelay"
      type="number"
      bind:value={selectedCall.delay}
      on:keyup={() => {$viewedDance.duration = $viewedDance.duration}}
    />
    {#if !$viewedDance.selection.delay}
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
      <p>Description: {getting ? "Loading..." : sourceCall?.text || ""}</p>
      {#if !getting}
      <Dependencies source={sourceCall} />
      {/if}
      <button on:click={() => {removeCall($viewedDance.selection.group, $viewedDance.selection.call)}}>Remove</button>
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
    padding: 0rem 3rem 3rem 3rem;
    width: 20rem;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
</style>