<script>
import { createEventDispatcher, getContext } from "svelte";
import Group from "./Group.svelte";

const dispatch = createEventDispatcher();

const {newDance} = getContext("newDance");

function findDuration() {
  $newDance.duration = Math.max(
    ...$newDance.dance.instructions.map((group) => {
      return group.reduce((previous, current) => {
        return previous + (current.beats ? current.beats : 0) + (current.delay ? current.delay : 0);
      }, 0)
    })
  );
}
$: $newDance.dance.instructions, findDuration();

function addGroup() {
  $newDance.selection = {group: $newDance.dance.instructions.length, call: 0, delay: true};
  $newDance.dance.instructions = [...$newDance.dance.instructions, []];
}
</script>

<div class="danceGraph">
  <button on:click={addGroup}>
    Add Group of Dancers
  </button>
  {#each $newDance.dance.instructions as group, i}
  <Group group={group} index={i}
    on:removeCall={(event) => {dispatch('removeCall', event.detail)}}
  />
  {/each}
</div>

<style>
  .danceGraph {
    display: flex;
    flex-direction: column;
    overflow: scroll;
    min-width: 20rem;
  }
</style>