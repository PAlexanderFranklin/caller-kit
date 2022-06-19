<script>
import { createEventDispatcher } from 'svelte';
// import {clickOutside} from "../../utils/clickOutside.js";
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
  {#each calls as call}
      <Call call={call} on:selectCall={() => {dispatch('selectCall', { call })}} />
  {/each}
</div>

<style>
  .CallList {
    padding: 3rem;
    width: 20rem;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
</style>