<script>
import { createEventDispatcher, getContext } from "svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import Call from "./Call.svelte";

export let group;
export let index;

const dispatch = createEventDispatcher();

const viewedDance = getContext("viewedDance");
const openModal = getContext('openModal');

async function deleteGroup() {
  openModal(
    async () => {
      if ($viewedDance.selection.group == index) {
        $viewedDance.selection = {group: 0, call: 0, delay: true};
      }
      else {
        $viewedDance.selection.group = $viewedDance.selection.group - 1;
      }
      $viewedDance.dance.instructions.splice(index, 1);
      $viewedDance.dance.instructions = [...$viewedDance.dance.instructions];
    },
    async () => {},
    {
      action: "remove",
      acting: "removing",
      noun: "group",
      item: `group ${index + 1}`,
      confirmColor: "red",
    }
  )
}

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
  {#if $viewedDance.editing}
  <button class="delete" on:click|stopPropagation={deleteGroup}><Delete color={"white"} /></button>
  <button class="start {
      $viewedDance.selection.group == index &&
      $viewedDance.selection.call == 0 &&
      $viewedDance.selection.delay == true
      ? "selectedStart" : ""
    }"
    on:click|stopPropagation={() => {$viewedDance.selection = {
      group: index,
      call: 0,
      delay: true
      };
    }}
  />
  {/if}
  {#each group as call, i}
  <Call call={call} groupIndex={index} index={i}
    on:removeCall={(event) => {dispatch('removeCall', event.detail)}}
  />
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