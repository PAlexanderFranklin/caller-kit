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
$: findDuration(), console.log($duration);
</script>

<div>
  <button on:click={() => {
    $newDance.dance.instructions.push([{beats: Math.ceil(Math.random() * 100)}]);
    findDuration();
  }}>
    a
  </button>
  {#each $newDance.dance.instructions as group}
    <div class="dancePart"></div>
  {/each}
</div>

<style>
  .dancePart {
  }
</style>