<script>
import { createEventDispatcher, getContext } from "svelte";
import Group from "./Group.svelte";

const dispatch = createEventDispatcher();

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

function addGroup() {
  $viewedDance.selection = {group: $viewedDance.dance.instructions.length, call: 0, delay: true};
  $viewedDance.dance.instructions = [...$viewedDance.dance.instructions, []];
}
</script>

<div class="danceGraph">
  {#each $viewedDance.dance.instructions as group, i}
  <Group group={group} index={i}
    on:removeCall={(event) => {dispatch('removeCall', event.detail)}}
  />
  {/each}
  {#if $viewedDance.editing}
  <button on:click={addGroup} class="AddGroup">
    Add Group of Dancers
  </button>
  {/if}
</div>

<style>
  .danceGraph {
    display: flex;
    flex-direction: column;
    overflow: scroll;
    max-height: 24rem;
    min-width: 20rem;
    width: 50rem;
  }
  .AddGroup {
    height: 3rem;
    width: 20rem;
    background-color: white;
  }
</style>