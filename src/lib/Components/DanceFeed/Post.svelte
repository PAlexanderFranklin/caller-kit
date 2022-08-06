<script>
import { createEventDispatcher, getContext } from 'svelte';
// import { downloadDance } from '/src/lib/utils/danceModule';
import MusicInfo from "/src/lib/Components/Common/Music/MusicInfo.svelte";
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";
import Play from "svelte-material-icons/Play.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
import Download from "svelte-material-icons/Download.svelte";

export let post;
let content = post.content;
let hiddenDetails = true;
  
const dispatch = createEventDispatcher();

// let openModal = getContext("openModal");

// function handleShareDance() {
//   openModal(
//     async () => {
//       const res = await shareDance({
//         id: dance.id,
//         title: dance.title,
//         skyfeed: dance.skyfeed,
//       });
//       console.log(res)
//       return res;
//     },
//     async () => {},
//     {
//       action: "share",
//       acting: "sharing",
//       text: "Are you sure you want to share this dance? Note that this will also share any dance calls that it uses.",
//       item: dance.title,
//       confirmColor: "green",
//     }
//   );
// }

</script>

<div class="Dance">
  <div class="Header">
    <div class="HeaderTitle">
      {content.title}
      <button on:click={() => {}}><Download color={"blue"} /></button>
    </div>
    <!-- <button on:click={handleDeleteDance}><Delete color={"red"} /></button> -->
    {#if hiddenDetails}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronDown color={"blue"} /></button>
    {:else}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronUp color={"blue"} /></button>
    {/if}
    <button on:click={() => {dispatch('selectDance', {dance: content.ext?.dance})}}><Play color={"green"} /></button>
  </div>
  <div class="Content">
    {#if content.ext?.dance?.music}
    {#each content.ext?.dance?.music as music}
      <MusicInfo musicRef={music} />
    {/each}
    {/if}
    {#if content.ext?.dance?.text}
      <div for="description">Description: {content.ext?.dance?.text}</div>
    {/if}
    <div>Duration in Beats: {content.ext?.dance.duration}</div>
    <Dependencies source={content.ext?.dance} />
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
    display: flex;
    justify-content: space-between;
  }
  hr {
    background: green;
    height: 1px;
    width: 100%;
  }
</style>