<script>
import { createEventDispatcher, getContext } from "svelte";

const dispatch = createEventDispatcher();

export let call;
export let groupIndex;
export let index;

const {newDance} = getContext("newDance");

function selectCall(delay) {
  // try {
  //   if (!$newDance.dance.instructions[$newDance.selection.group][$newDance.selection.call].beats) {
  //     dispatch('removeCall', {groupIndex: $newDance.selection.group, callIndex: $newDance.selection.call})
  //   }
  // }
  // catch {}
  $newDance.selection = {
    group: groupIndex,
    call: index,
    delay
  };
}

</script>
  
<div
  class="delay {
    $newDance.selection.group == groupIndex &&
    $newDance.selection.call == index &&
    $newDance.selection.delay == true
    ? "selectedDelay" : ""
  }"
  style="min-width: {call.delay | 0}rem; max-width: {call.delay | 0}rem;"
  on:click|stopPropagation={() => {selectCall(true)}}
/>
<div
  class="call {
    $newDance.selection.group == groupIndex &&
    $newDance.selection.call == index &&
    $newDance.selection.delay == false
    ? "selectedCall" : ""
  }"
  style="min-width: {call.beats}rem; max-width: {call.beats}rem;"
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