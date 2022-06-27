<script>
import { getContext, onMount } from "svelte";
import { writable } from "svelte/store";

export let call;
export let groupIndex;

const {newDance} = getContext("newDance");
const groupCallIndex = getContext('groupCallIndex');
const callIndex = writable(0);

onMount(() => {
  $callIndex = $groupCallIndex;
  $groupCallIndex = $groupCallIndex + 1;
})

</script>
  
<div
  class="delay {
    $newDance.selection.group == groupIndex &&
    $newDance.selection.call == $callIndex &&
    $newDance.selection.delay == true
    ? "selectedDelay" : ""
  }"
  style="min-width: {call.delay | 0}rem; max-width: {call.delay | 0}rem;"
  on:click|stopPropagation={() => {$newDance.selection = {
    group: groupIndex,
    call: $callIndex,
    delay: true
    };
  }}
/>
<div
  class="call {
    $newDance.selection.group == groupIndex &&
    $newDance.selection.call == $callIndex &&
    $newDance.selection.delay == false
    ? "selectedCall" : ""
  }"
  style="min-width: {call.beats}rem; max-width: {call.beats}rem;"
  on:click|stopPropagation={() => {$newDance.selection = {
    group: groupIndex,
    call: $callIndex,
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