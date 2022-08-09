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
      text: "Are you sure you want to delete this dance?",
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
      console.log("shared:", res)
      return res;
    },
    async () => {},
    {
      action: "share",
      acting: "sharing",
      text: "Are you sure you want to share this dance? Note that this will also share any dance calls that it uses.",
      item: dance.title,
      confirmColor: "blue",
    }
  );
}

</script>

<div class="Dance">
  <div class="Header">
    <div class="HeaderTitle">
      {dance.title}
    </div>
    <button on:click={handleShareDance}><Share color={"blue"} /></button>
    <button on:click={handleDeleteDance}><Delete color={"red"} /></button>
    <button on:click={() => dispatch('editDance', {dance})}><Pencil color={"yellow"} /></button>
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
    width: 40%;
    display: flex;
    justify-content: space-between;
  }
  hr {
    background: green;
    height: 1px;
    width: 100%;
  }
</style>