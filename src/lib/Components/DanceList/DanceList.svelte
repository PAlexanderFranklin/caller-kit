<script>
import { createEventDispatcher } from 'svelte';
import Dance from './Dance.svelte';

export let dances = [];

const dispatch = createEventDispatcher();
</script>

<div class="DanceList">
  {#each dances as dance (dance.id)}
      <Dance
        dance={dance}
        on:selectDance={() => {dispatch('selectDance', { dance })}}
        on:editDance={() => {dispatch('editDance', { dance })}}
      />
  {/each}
</div>

<style>
  .DanceList {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 3rem;
    max-height: 50rem;
    overflow-y: scroll;
    width: 80%;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
</style>