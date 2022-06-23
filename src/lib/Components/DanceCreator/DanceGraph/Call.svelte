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
  style="width: {call.delay}rem;"
>
  {$callIndex}
</div>
<div
  class="call {
    $newDance.selection.group == groupIndex &&
    $newDance.selection.call == $callIndex &&
    $newDance.selection.delay == false
    ? "selectedCall" : ""
  }"
  on:click={() => {$newDance.selection = {
    group: groupIndex,
    call: $callIndex,
    delay: false
    };
  }}
  style="width: {call.beats}rem;"
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