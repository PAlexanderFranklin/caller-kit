<script>
import { getContext } from "svelte";
import { writable } from "svelte/store";
import DanceCreator from "./DanceCreator.svelte";

const {newDance} = getContext("newDance");

const duration = writable(0);
function findDuration() {
  $duration = Math.max(
    ...$newDance.dance.instructions.map((group) => {
      return group.reduce((previous, current) => {
        return previous + current.beats;
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
  {#each $newDance.dance.instructions as group}
    <div class="danceGroup" style="width: {$duration + 4}rem;">
      {#each group as call}
        <div class="call" style="width: {call.beats}rem;"></div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .danceGraph {
    display: flex;
    flex-direction: column;
  }
  .danceGroup {
    display: flex;
    height: 2rem;
    border: black solid 1px;
  }
  .call {
    border: grey solid 2px;
  }
</style>