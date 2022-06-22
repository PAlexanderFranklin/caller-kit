<script>
import { getContext } from "svelte";
export let group

const {newDance} = getContext("newDance");
let groupIndex = 0;

</script>

<div class="danceGroup" style="width: {$newDance.duration + 4}rem;">
  {#each group as call}
    <div class="wait" style="width: {call.delay}rem;"></div>
    <div class="call" style="width: {call.beats}rem;">{call.title}</div>
  {/each}
</div>

<style>
  .danceGroup {
    display: flex;
    height: 2rem;
    background-color: lightgrey;
    border: black solid 1px;
  }
  .selectedGroup {
    background-color: grey;
  }
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