<script>
import { createEventDispatcher } from 'svelte';
// import {clickOutside} from "../../utils/clickOutside.js";
import { calls } from "../../utils/danceModule";
import CreateCall from "./CreateCall.svelte";

const dispatch = createEventDispatcher();

let hidden = true;
</script>

<div>
  {#if hidden}
    <button on:click={() => {hidden = false}}>New Call</button>
  {:else}
    <CreateCall on:closeModal={() => {hidden = true}} />
  {/if}
  {#each $calls as call}
    <div on:click={() => {dispatch('selectCall', { call })}}>
      <h1>
        Name: {call.title}
      </h1>
      <p>
        Description: {call.text}
      </p>
      <span>
        Duration in Beats: {call.beats}
      </span>
    </div>
  {/each}
</div>