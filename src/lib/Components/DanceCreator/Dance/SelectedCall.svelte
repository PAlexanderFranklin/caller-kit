<script>
import { getContext } from "svelte";

const {newDance} = getContext("newDance");

let checkCall = {};
let selectedCall = {};

$: {
  checkCall = $newDance.dance.instructions[$newDance.selection.group][$newDance.selection.call];
  selectedCall = checkCall ? checkCall : {};
}

</script>

<div class="SelectedCall">
  <label for="beatsInSelection">Duration in Beats: </label>
  <input
    id="beatsInSelection"
    type="number"
    bind:value={selectedCall.beats}
    on:keyup={() => {$newDance.duration = $newDance.duration}}
  />
  <label for="beatsIndelay">Delay in Beats: </label>
  <input
    id="beatsIndelay"
    type="number"
    bind:value={selectedCall.delay}
    on:keyup={() => {$newDance.duration = $newDance.duration}}
  />
</div>

<style>
  .SelectedCall {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 3rem;
    width: 20rem;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
</style>