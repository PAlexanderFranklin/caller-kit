<script>
import { getContext } from "svelte";
import { writable } from "svelte/store";
import Group from "./Group.svelte";

const {newDance} = getContext("newDance");

function findDuration() {
  $newDance.duration = Math.max(
    ...$newDance.dance.instructions.map((group) => {
      return group.reduce((previous, current) => {
        return previous + current.beats + current.delay;
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
  <div class="danceGroup" style="width: {$newDance.duration + 4}rem;" />
</div>

<style>
  .danceGraph {
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }
</style>