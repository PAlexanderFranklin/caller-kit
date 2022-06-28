<script>
import { createEventDispatcher, getContext } from "svelte";

const dispatch = createEventDispatcher();

const {newDance} = getContext("newDance");

let checkCall = {};
let selectedCall = {};

$: {
  try {
    checkCall = $newDance.dance.instructions[$newDance.selection.group][$newDance.selection.call];
  }
  catch {}
  selectedCall = checkCall ? checkCall : {};
}

function removeCall(groupIndex, callIndex) {
  dispatch('removeCall', {groupIndex: groupIndex, callIndex: callIndex});
}

</script>

<div class="SelectedCall">
  {#if $newDance.selection.call != $newDance.dance.instructions[$newDance.selection.group].length && !$newDance.selection.delay}
  <h4>Name: {selectedCall.title}</h4>
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
  <label for="beatsIndelay">Delay in Beats: </label>
  <input
    id="beatsIndelay"
    type="number"
    bind:value={selectedCall.delay}
    on:keyup={() => {$newDance.duration = $newDance.duration}}
  />
  <button on:click={() => {removeCall($newDance.selection.group, $newDance.selection.call)}}>Remove</button>
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