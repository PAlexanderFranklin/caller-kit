<script>
import { createEventDispatcher } from 'svelte';
// import {clickOutside} from "../../utils/clickOutside.js";
import { calls } from "../../utils/danceModule";
import Call from './Call.svelte';
import CreateCall from "./CreateCall.svelte";

const dispatch = createEventDispatcher();

let hidden = true;
</script>

<div class="CallList">
  {#if hidden}
    <button on:click={() => {hidden = false}}>New Call</button>
  {:else}
    <CreateCall on:closeModal={() => {hidden = true}} />
  {/if}
  {#each $calls as call}
      <Call call={call} on:selectCall={() => {dispatch('selectCall', { call })}} />
  {/each}
</div>

<style>
  .CallList {
    border: 2px;
    padding: 3rem;
    border-color: black;
  }
</style>