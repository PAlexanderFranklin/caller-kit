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
  class="wait"
  style="min-width: {call.delay}rem; max-width: {call.beats}rem;"
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
  .wait {
    height: 100%;
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