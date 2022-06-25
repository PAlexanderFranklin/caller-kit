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

<div class="danceGroup" style="min-width: {$newDance.duration + 4}rem; max-width: {$newDance.duration + 4}rem;"
  on:click|stopPropagation={() => {$newDance.selection = {
    group: $groupIndex,
    call: $newDance.dance.instructions[$groupIndex].length,
    delay: false
    };
  }}
>
  {#each group as call}
  <Call call={call} groupIndex={$groupIndex} />
  {/each}
</div>

<style>
  .danceGroup {
    display: flex;
    padding-right: 4rem;
    height: 2rem;
    background-color: lightgrey;
    border: black solid 1px;
  }
  .selectedGroup {
    background-color: grey;
  }
</style>