<script>
import { createEventDispatcher } from 'svelte';
import Call from './Call.svelte';
import CreateCall from "./CreateCall.svelte";

export let calls = [];

const dispatch = createEventDispatcher();

let hidden = true;
</script>

<div class="CallList">
  {#if hidden}
    <button on:click={() => {hidden = false}}>New Call</button>
  {:else}
    <CreateCall on:closeModal={() => {hidden = true}} />
  {/if}
  {#each calls as call (call.id)}
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