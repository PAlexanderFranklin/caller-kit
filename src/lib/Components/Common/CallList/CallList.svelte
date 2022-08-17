<script>
import { createEventDispatcher } from 'svelte';
import Call from './Call.svelte';
import CallEditor from "./CallEditor.svelte";

export let calls = [];
let filteredCalls = calls;
let filterText = "";

const dispatch = createEventDispatcher();

let editingCall = false;

$: filterText, filteredCalls = calls.filter((call) => {
  let filter = new RegExp(filterText.toLowerCase());
  return Boolean(filterText === ""
    || call.title?.toLowerCase().match(filter)
  )
})

</script>

<div class="CallList">
  <div>
    Search: <input type="text" bind:value={filterText} />
  </div>
  {#if editingCall}
    <CallEditor on:closeModal={() => {editingCall = false}} />
  {:else}
    <button on:click={() => {editingCall = true}}>New Call</button>
  {/if}
  {#each filteredCalls as call (call.id)}
    <Call call={call} on:selectCall={() => {dispatch('selectCall', { call })}} />
  {/each}
</div>

<style>
  .CallList {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 3rem;
    min-width: 20rem;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
</style>