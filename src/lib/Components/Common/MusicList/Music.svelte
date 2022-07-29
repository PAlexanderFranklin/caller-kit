<script>
import { createEventDispatcher, getContext } from 'svelte';
import { musicList, deleteMusic } from '/src/lib/utils/danceModule';
import ArrowRight from "svelte-material-icons/ArrowRight.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
import Pencil from "svelte-material-icons/Pencil.svelte";
import UpdateMusic from './UpdateMusic.svelte';

export let music;
let hiddenDetails = true;
let editing = false;
  
const dispatch = createEventDispatcher();

let openModal = getContext("openModal");

function handleDeleteMusic() {
  openModal(
    async () => {
      const res = await deleteMusic(music.id);
      $musicList = res.musicList;
      return res;
    },
    async () => {},
    {
      action: "delete",
      acting: "deleting",
      noun: "music",
      item: music.title,
      confirmColor: "red",
    }
  );
}

</script>

<div class="Music">
  <div class="Header">
    <span class="HeaderTitle">{music.title}</span>
    <button on:click={handleDeleteMusic}><Delete color={"red"} /></button>
    <button on:click={() => {editing = !editing}}><Pencil color={"yellow"} /></button>
    {#if hiddenDetails}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronDown color={"blue"} /></button>
    {:else}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronUp color={"blue"} /></button>
    {/if}
    <button on:click={() => {dispatch('selectMusic', {music})}}><ArrowRight color={"green"} /></button>
  </div>
  {#if editing}
    <UpdateMusic on:closeModal={() => {editing = false}} music={music} />
  {/if}
  {#if !hiddenDetails}
    <p>
      Link: <a href={music.link}>{music.link}</a>
    </p>
  {/if}
</div>
<hr>

<style>
  .Music {
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