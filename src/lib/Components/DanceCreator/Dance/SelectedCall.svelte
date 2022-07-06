<script>
import { createEventDispatcher, getContext } from "svelte";
import { getCallById } from '/src/lib/utils/danceModule';
import CallDependencies from "/src/lib/Components/Common/Calls/CallDependencies.svelte";

const dispatch = createEventDispatcher();

const newDance = getContext("newDance");

let checkCall = {};
let selectedCall = {};

let showFootwork = false;
let showHold = false;

$: {
  try {
    checkCall = $newDance.dance.instructions[$newDance.selection.group][$newDance.selection.call];
  }
  catch {}
  selectedCall = checkCall ? checkCall : {};
}

let sourceCall = {};
async function getCall() {
  if (selectedCall.id) {
    try {
      const res = await getCallById(selectedCall.id);
      if (res.call) {
        sourceCall = res.call;
      }
    }
    catch (err) {
      console.log(err);
      sourceCall = {}
    }
  }
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
      on:keyup={() => {$newDance.duration = $newDance.duration}}
    />
    {#if !$newDance.selection.delay}
      <label for="beatsInSelection">Duration in Beats: </label>
      <input
        id="beatsInSelection"
        type="number"
        bind:value={selectedCall.beats}
        on:keyup={() => {
          if (selectedCall.beats) {
            $newDance.duration = $newDance.duration;
          }
        }}
      />
      <p>Description: {sourceCall?.text || ""}</p>
      <CallDependencies sourceCall={sourceCall} />
      <button on:click={() => {removeCall($newDance.selection.group, $newDance.selection.call)}}>Remove</button>
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