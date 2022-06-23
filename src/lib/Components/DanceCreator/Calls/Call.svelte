<script>
import { createEventDispatcher } from 'svelte';
import { clickOutside } from '/src/lib/utils/clickOutside';
import { deleteCall } from '/src/lib/utils/danceModule';
import ArrowRight from "svelte-material-icons/ArrowRight.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";

export let call;
let hiddenDetails = true;
let hiddenDelete = true;
  
const dispatch = createEventDispatcher();
</script>

<div class="Call">
  <div class="Header">
    <span class="HeaderTitle">{call.title}</span>
    <button on:click={() => {hiddenDelete = !hiddenDelete}}><Delete color={"red"} /></button>
    {#if hiddenDetails}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronDown color={"blue"} /></button>
    {:else}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronUp color={"blue"} /></button>
    {/if}
    <button on:click={() => {dispatch('selectCall', {call})}}><ArrowRight color={"green"} /></button>
  </div>
  {#if !hiddenDetails}
    <p>
      Description: {call.text}
    </p>
    <span>
      Duration in Beats: {call.beats}
    </span>
  {/if}
  {#if !hiddenDelete}
    <div use:clickOutside on:clickOutside={() => {hiddenDelete = true}}>
      Are you sure you want to delete?
      <button class="deleteButton" on:click={() => {deleteCall(call.id)}}>Delete</button>
      <button>Cancel</button>
    </div>
  {/if}
</div>
<hr>

<style>
  .Call {
    width: 100%;
  }
  .Header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .HeaderTitle {
    width: 50%;
  }
  .deleteButton {
    color: red;
  }
  hr {
    background: green;
    height: 1px;
    width: 100%;
  }
</style>