<script>
import { getContext } from "svelte";
import { getCallByRef } from '/src/lib/utils/danceModule';
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";

const viewedDance = getContext("viewedDance");

let checkCall = {};
let selectedCall = {};
let sourceCall = {};

$: {
  try {
    checkCall = $viewedDance.dance.instructions[$viewedDance.selection.group][$viewedDance.selection.call];
  }
  catch {}
  selectedCall = checkCall ? checkCall : {};
}

let getting = false;
async function getCall() {
  getting = true;
  sourceCall = {};
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

</script>

<div class="SelectedCall">
  {#if Object.keys(selectedCall).length !== 0}
    <h4>Name: {selectedCall.title || "N/A"}</h4>
    {#if selectedCall.delay}
    <div>Delay in Beats: {selectedCall.delay}</div>
    {/if}
    {#if !$viewedDance.selection.delay}
      <div>Duration in Beats: {selectedCall.beats}</div>
      <p>Description: {getting ? "Loading..." : sourceCall?.text || ""}</p>
      {#if getting}
      Loading...
      {:else}
      <Dependencies source={sourceCall} />
      {/if}
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