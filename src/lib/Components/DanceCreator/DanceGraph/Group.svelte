<script>
import { getContext, onMount, setContext } from "svelte";
import { writable } from "svelte/store";
import Call from "./Call.svelte";

export let group

const {newDance} = getContext("newDance");
const groupIndex = writable(0);
const groupCallIndex = writable(0);
setContext('groupCallIndex', groupCallIndex);

onMount(() => {
  $groupIndex = $newDance.indexing.group;
  $newDance.indexing.group = $newDance.indexing.group + 1;
})

</script>

<div class="danceGroup" style="width: {$newDance.duration + 4}rem;">
  {$groupIndex}
  {#each group as call}
  <Call call={call} groupIndex={$groupIndex} />
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