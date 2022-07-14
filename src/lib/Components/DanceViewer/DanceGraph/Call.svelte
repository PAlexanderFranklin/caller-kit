<script>
import { createEventDispatcher, getContext } from "svelte";

const dispatch = createEventDispatcher();

export let call;
export let groupIndex;
export let index;

const viewedDance = getContext("viewedDance");

function selectCall(delay) {
  try {
    if (!$viewedDance.dance.instructions[$viewedDance.selection.group][$viewedDance.selection.call].beats) {
      dispatch('removeCall', {groupIndex: $viewedDance.selection.group, callIndex: $viewedDance.selection.call})
    }
  }
  catch {}
  $viewedDance.selection = {
    group: groupIndex,
    call: index,
    delay
  };
}

</script>
  
<div
  class="delay {
    $viewedDance.selection.group == groupIndex &&
    $viewedDance.selection.call == index &&
    $viewedDance.selection.delay == true
    ? "selectedDelay" : ""
  }"
  style="min-width: {call.delay | 0}rem; max-width: {call.delay | 0}rem;"
  on:click|stopPropagation={() => {selectCall(true)}}
/>
<div
  class="call {
    $viewedDance.selection.group == groupIndex &&
    $viewedDance.selection.call == index &&
    $viewedDance.selection.delay == false
    ? "selectedCall" : ""
  }"
  style="min-width: {call.beats - 0.1}rem; max-width: {call.beats}rem;"
  on:click|stopPropagation={() => {selectCall(false)}}
>
  {call.title}
</div>
  
<style>
  .delay {
    height: 100%;
    background-color: lightgrey;
  }
  .selectedDelay {
    background-color: grey;
  }
  .call {
    overflow: hidden;
    background-color: greenyellow;
    border: grey solid 1px;
  }
  .selectedCall {
    background-color: forestgreen;
  }
</style>