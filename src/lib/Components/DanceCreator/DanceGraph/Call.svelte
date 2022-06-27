<script>
import { getContext } from "svelte";

export let call;
export let groupIndex;
export let index;

const {newDance} = getContext("newDance");

</script>
  
<div
  class="delay {
    $newDance.selection.group == groupIndex &&
    $newDance.selection.call == index &&
    $newDance.selection.delay == true
    ? "selectedDelay" : ""
  }"
  style="min-width: {call.delay | 0}rem; max-width: {call.delay | 0}rem;"
  on:click|stopPropagation={() => {$newDance.selection = {
    group: groupIndex,
    call: index,
    delay: true
    };
  }}
/>
<div
  class="call {
    $newDance.selection.group == groupIndex &&
    $newDance.selection.call == index &&
    $newDance.selection.delay == false
    ? "selectedCall" : ""
  }"
  style="min-width: {call.beats}rem; max-width: {call.beats}rem;"
  on:click|stopPropagation={() => {$newDance.selection = {
    group: groupIndex,
    call: index,
    delay: false
    };
  }}
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