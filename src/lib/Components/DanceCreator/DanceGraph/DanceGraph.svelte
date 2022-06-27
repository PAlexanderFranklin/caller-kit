<script>
import { getContext } from "svelte";
import Group from "./Group.svelte";

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
  $newDance.dance.instructions = [...$newDance.dance.instructions, []];
}
</script>

<div class="danceGraph">
  <button on:click={addGroup}>
    Add Group
  </button>
  {#each $newDance.dance.instructions as group, i}
  <Group group={group} index={i} />
  {/each}
</div>

<style>
  .danceGraph {
    display: flex;
    flex-direction: column;
    overflow: scroll;
    width: 40rem;
  }
</style>