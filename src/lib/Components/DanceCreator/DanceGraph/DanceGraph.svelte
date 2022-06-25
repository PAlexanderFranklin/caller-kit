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
</script>

<div class="danceGraph">
  <button on:click={() => {
    $newDance.dance.instructions = [...$newDance.dance.instructions, [{beats: Math.ceil(Math.random() * 100)}]];
  }}>
    a
  </button>
  {#each $newDance.dance.instructions as group (group)}
  <Group group={group} />
  {/each}
  <div class="danceGroup" style="min-width: {$newDance.duration + 4}rem; max-width: {$newDance.duration + 4}rem;" />
</div>

<style>
  .danceGraph {
    display: flex;
    flex-direction: column;
    overflow: scroll;
    width: 40rem;
  }
</style>