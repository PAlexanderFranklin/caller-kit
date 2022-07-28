<script>
import { createEventDispatcher, getContext } from 'svelte';
import { calls, deleteCall } from '/src/lib/utils/danceModule';
import ArrowRight from "svelte-material-icons/ArrowRight.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
import Pencil from "svelte-material-icons/Pencil.svelte";
import Dependencies from '/src/lib/Components/Common/Calls/Dependencies.svelte';
import CallEditor from './CallEditor.svelte';

export let call;
let hiddenDetails = true;
let editing = false;
  
const dispatch = createEventDispatcher();

let openModal = getContext("openModal");

function handleDeleteCall() {
  openModal(
    async () => {
      const res = await deleteCall(call.id);
      $calls = res.calls;
      return res;
    },
    async () => {},
    {
      action: "delete",
      acting: "deleting",
      noun: "call",
      item: call.title,
      confirmColor: "red",
    }
  );
}

</script>

<div class="Call">
  <div class="Header">
    <span class="HeaderTitle">{call.title}</span>
    <button on:click={handleDeleteCall}><Delete color={"red"} /></button>
    <button on:click={() => {editing = !editing}}><Pencil color={"yellow"} /></button>
    {#if hiddenDetails}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronDown color={"blue"} /></button>
    {:else}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronUp color={"blue"} /></button>
    {/if}
    <button on:click={() => {dispatch('selectCall', {call})}}><ArrowRight color={"green"} /></button>
  </div>
  {#if editing}
    <CallEditor on:closeModal={() => {editing = false}} call={call} />
  {/if}
  {#if !hiddenDetails}
    <p>
      Description: {call.text}
    </p>
    <span>
      Duration in Beats: {call.beats}
    </span>
    <Dependencies source={call} />
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
  hr {
    background: green;
    height: 1px;
    width: 100%;
  }
</style>