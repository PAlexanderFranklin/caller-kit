<script>
import { getContext } from "svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import Call from "./Call.svelte";

export let group;
export let index;

const viewedDance = getContext("viewedDance");

</script>

<div class="danceGroup {
    $viewedDance.selection.group == index &&
    $viewedDance.selection.call == $viewedDance.dance.instructions[index].length &&
    $viewedDance.selection.delay == false
    ? "selectedGroup" : ""
  }"
  style="min-width: {$viewedDance.duration + 8}rem; max-width: {$viewedDance.duration + 8}rem;"
  on:click|stopPropagation={() => {$viewedDance.selection = {
    group: index,
    call: $viewedDance.dance.instructions[index].length,
    delay: false
    };
  }}
>
  {#each group as call, i}
  <Call call={call} groupIndex={index} index={i} />
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
</style>