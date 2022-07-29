<script>
import { createEventDispatcher } from 'svelte';
import Dance from './Dance.svelte';

export let dances = [];
let filteredDances = dances;
let filterText = "";

const dispatch = createEventDispatcher();

$: filterText, filteredDances = dances.filter((dance) => {
  let filter = new RegExp(filterText.toLowerCase());
  return Boolean(filterText === ""
    || dance.title?.toLowerCase().match(filter)
    || dance.text?.toLowerCase().match(filter)
    || dance.footwork?.title?.toLowerCase().match(filter)
    || dance.hold?.title?.toLowerCase().match(filter)
  )
})

</script>

<div class="DanceList">
  <div>
    Search: <input type="text" bind:value={filterText} />
  </div>
  {#each filteredDances as dance (dance.id)}
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