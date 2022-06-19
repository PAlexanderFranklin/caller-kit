<script>
import { createEventDispatcher } from 'svelte';
import { clickOutside } from '../../utils/clickOutside';
import CheckBold from "svelte-material-icons/CheckBold.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";

export let call;
let hiddenDetails = true;
let hiddenDelete = true;
  
const dispatch = createEventDispatcher();
</script>

<div>
  <div class="Call Header">
    Name: {call.title}
    <button on:click={() => {dispatch('selectCall', { call })}}><CheckBold color={"green"} /></button>
    <button on:click={() => {hiddenDelete = !hiddenDelete}}><Delete color={"red"} /></button>
    {#if hiddenDetails}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronDown color={"blue"} /></button>
    {:else}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronUp color={"blue"} /></button>
    {/if}
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
    <div use:clickOutside on:clickOutside={() => {hiddenDelete = true}}>Are you sure you want to delete? <button class="deleteButton">Delete</button></div>
  {/if}
</div>

<style>
  .deleteButton {
    color: red;
  }
</style>