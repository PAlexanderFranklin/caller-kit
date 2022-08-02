<script>
import { createEventDispatcher, getContext } from 'svelte';
import { dances, deleteDance } from '/src/lib/utils/danceModule';
import { shareDance } from '/src/lib/utils/sharing';
import Play from "svelte-material-icons/Play.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
import Pencil from "svelte-material-icons/Pencil.svelte";
import Share from "svelte-material-icons/Share.svelte";

export let dance;
let hiddenDetails = true;
  
const dispatch = createEventDispatcher();

let openModal = getContext("openModal");

function handleDeleteDance() {
  openModal(
    async () => {
      const res = await deleteDance(dance.id);
      $dances = res.dances;
      return res;
    },
    async () => {},
    {
      action: "delete",
      acting: "deleting",
      noun: "dance",
      item: dance.title,
      confirmColor: "red",
    }
  );
}

function handleShareDance() {
  openModal(
    async () => {
      const res = await shareDance({
        id: dance.id,
        title: dance.title,
        skyfeed: dance.skyfeed,
      });
      console.log(res)
      return res;
    },
    async () => {},
    {
      action: "share",
      acting: "sharing",
      noun: "dance",
      item: dance.title,
      confirmColor: "green",
    }
  );
}

</script>

<div class="Dance">
  <div class="Header">
    <span class="HeaderTitle">{dance.title}</span>
    <button on:click={handleDeleteDance}><Delete color={"red"} /></button>
    <button on:click={() => dispatch('editDance', {dance})}><Pencil color={"yellow"} /></button>
    <button on:click={handleShareDance}><Share color={"blue"} /></button>
    {#if hiddenDetails}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronDown color={"blue"} /></button>
    {:else}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronUp color={"blue"} /></button>
    {/if}
    <button on:click={() => {dispatch('selectDance', {dance})}}><Play color={"green"} /></button>
  </div>
</div>
<hr>

<style>
  .Dance {
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