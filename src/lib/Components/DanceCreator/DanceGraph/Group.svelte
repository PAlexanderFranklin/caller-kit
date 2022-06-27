<script>
import { getContext, onMount, setContext } from "svelte";
import { writable } from "svelte/store";
import Delete from "svelte-material-icons/Delete.svelte";
import Call from "./Call.svelte";

export let group

const {newDance} = getContext("newDance");
const groupIndex = writable(0);
const groupCallIndex = writable(0);
setContext('groupCallIndex', groupCallIndex);

async function deleteGroup() {
  if ($newDance.selection.group == $groupIndex) {
    $newDance.selection = {group: 0, call: 0, delay: true};
  }
  $newDance.dance.instructions.splice($groupIndex, 1);
  $newDance.dance.instructions = [...$newDance.dance.instructions];
}

onMount(() => {
  $groupIndex = $newDance.groupIndex;
  $newDance.groupIndex = $newDance.groupIndex + 1;
});

</script>

<div class="danceGroup {
  $newDance.selection.group == $groupIndex &&
  $newDance.selection.call == $newDance.dance.instructions[$groupIndex].length &&
  $newDance.selection.delay == false
  ? "selectedGroup" : ""
}"
  style="min-width: {$newDance.duration + 8}rem; max-width: {$newDance.duration + 8}rem;"
  on:click|stopPropagation={() => {$newDance.selection = {
    group: $groupIndex,
    call: $newDance.dance.instructions[$groupIndex].length,
    delay: false
    };
  }}
>
  <button class="delete" on:click|stopPropagation={deleteGroup}><Delete color={"white"} /></button>
  <button class="start {
      $newDance.selection.group == $groupIndex &&
      $newDance.selection.call == 0 &&
      $newDance.selection.delay == true
      ? "selectedStart" : ""
    }"
    on:click|stopPropagation={() => {$newDance.selection = {
      group: $groupIndex,
      call: 0,
      delay: true
      };
    }}
  />
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
  .delete {
    width: 2rem;
    background-color: red;
  }
  .start {
    width: 2rem;
    background-color: lightgrey;
  }
  .selectedStart {
    background-color: grey;
  }
</style>