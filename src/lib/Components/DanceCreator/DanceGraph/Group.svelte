<script>
import { createEventDispatcher, getContext } from "svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import Call from "./Call.svelte";

export let group;
export let index;

const dispatch = createEventDispatcher();

const newDance = getContext("newDance");

const openModal = getContext('openModal');

async function deleteGroup() {
  openModal(
    async () => {
      if ($newDance.selection.group == index) {
        $newDance.selection = {group: 0, call: 0, delay: true};
      }
      else {
        $newDance.selection.group = $newDance.selection.group - 1;
      }
      $newDance.dance.instructions.splice(index, 1);
      $newDance.dance.instructions = [...$newDance.dance.instructions];
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
    $newDance.selection.group == index &&
    $newDance.selection.call == $newDance.dance.instructions[index].length &&
    $newDance.selection.delay == false
    ? "selectedGroup" : ""
  }"
  style="min-width: {$newDance.duration + 8}rem; max-width: {$newDance.duration + 8}rem;"
  on:click|stopPropagation={() => {$newDance.selection = {
    group: index,
    call: $newDance.dance.instructions[index].length,
    delay: false
    };
  }}
>
  <button class="delete" on:click|stopPropagation={deleteGroup}><Delete color={"white"} /></button>
  <button class="start {
      $newDance.selection.group == index &&
      $newDance.selection.call == 0 &&
      $newDance.selection.delay == true
      ? "selectedStart" : ""
    }"
    on:click|stopPropagation={() => {$newDance.selection = {
      group: index,
      call: 0,
      delay: true
      };
    }}
  />
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