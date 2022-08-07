<script>
import { createEventDispatcher, getContext } from 'svelte';
import { FeedDAC } from 'skynet-dacs-library';
// import { downloadDance } from '/src/lib/utils/danceModule';
import MusicInfo from "/src/lib/Components/Common/Music/MusicInfo.svelte";
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";
import Play from "svelte-material-icons/Play.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
import Download from "svelte-material-icons/Download.svelte";

export let post;
console.log(post);

const feedDAC = new FeedDAC();

let content = post.content;
let hiddenDetails = true;

const userId = getContext('userId');
const openModal = getContext('openModal');
  
const dispatch = createEventDispatcher();

// let openModal = getContext("openModal");

function handleDeletePost() {
  openModal(
    async () => {
      const res = await feedDAC.deletePost(post.ref);
      return res;
    },
    async () => {},
    {
      action: "delete",
      acting: "deleting",
      text: "Are you sure you want to delete this post? This will not delete it from your module storage if it is stored there, just from your skyfeed.",
      item: post.content?.title,
      confirmColor: "red",
    }
  );
}

</script>

<div class="Dance">
  <div class="Header">
    <div class="HeaderTitle">
      {content.title}
      <button on:click={() => {}}><Download color={"blue"} /></button>
    </div>
    {#if post.ref?.match($userId)}
    <!-- <button on:click={handleDeletePost}><Delete color={"red"} /></button> -->
    {/if}
    {#if hiddenDetails}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronDown color={"blue"} /></button>
    {:else}
      <button on:click={() => {hiddenDetails = !hiddenDetails}}><ChevronUp color={"blue"} /></button>
    {/if}
    <button on:click={() => {dispatch('selectDance', {dance: content.ext?.dance})}}><Play color={"green"} /></button>
  </div>
  {#if !hiddenDetails}
  <div class="Content">
    {#if content.ext?.dance?.music}
    {#each content.ext?.dance?.music as music}
      <MusicInfo musicRef={music} />
    {/each}
    {/if}
    {#if content.ext?.dance?.text}
      <div for="description">Description: {content.ext?.dance?.text}</div>
    {/if}
    <Dependencies source={content.ext?.dance} />
  </div>
  {/if}
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