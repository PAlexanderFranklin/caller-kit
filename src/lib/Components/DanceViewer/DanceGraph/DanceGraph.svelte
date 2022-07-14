<script>
import { getContext } from "svelte";
import Group from "./Group.svelte";

const viewedDance = getContext("viewedDance");

function findDuration() {
  $viewedDance.duration = Math.max(
    ...$viewedDance.dance.instructions.map((group) => {
      return group.reduce((previous, current) => {
        return previous + (current.beats ? current.beats : 0) + (current.delay ? current.delay : 0);
      }, 0)
    })
  );
}
$: $viewedDance.dance.instructions, findDuration();
</script>

<div class="danceGraph">
  {#each $viewedDance.dance.instructions as group, i}
  <Group group={group} index={i} />
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