<script>
import { createEventDispatcher, getContext } from 'svelte';
import { FeedDAC } from 'skynet-dacs-library';
import { dances, getDanceByRef, insertDance, updateDance } from '/src/lib/utils/danceModule';
import MusicInfo from "/src/lib/Components/Common/Music/MusicInfo.svelte";
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";
import Play from "svelte-material-icons/Play.svelte";
import ClipboardOutline from "svelte-material-icons/ClipboardOutline.svelte";
import Delete from "svelte-material-icons/Delete.svelte";
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
import Download from "svelte-material-icons/Download.svelte";

export let post;

const feedDAC = new FeedDAC();

let content = post.content;
let hiddenDetails = true;

const currentUserId = getContext('currentUserId');
const openModal = getContext('openModal');
  
const dispatch = createEventDispatcher();

async function copyDanceLink() {
  await navigator.clipboard.writeText(`callerkit.hns.skynetfree.net/#/dance/${post.ref.split("//")[1]}`);
}

async function handleSaveDance() {
  let userDance;
  try {
    const res = await getDanceByRef({id: content?.ext?.dance?.id});
    userDance = res.dance;
  } catch (error) {
    userDance = null;
  }
  if (userDance) {
    openModal(
      async () => {
        const res = await updateDance({...content?.ext?.dance, skyfeed: post.ref});
        $dances = res.dances;
        return res;
      },
      async () => {},
      {
        action: "overwrite",
        acting: "overwriting",
        text: "A dance with the same id was found in your personal storage! \n If you save this dance, it will overwrite the version in your personal storage, are you sure you want to do that?",
        item: `Title: New: ${content?.ext?.dance?.title}, Old: ${userDance.title} \n Id: ${userDance.id}`,
        confirmColor: "red",
      }
    );
  }
  else {
    openModal(
      async () => {
        const res = await insertDance({...content?.ext?.dance, skyfeed: post.ref});
        $dances = res.dances;
        return res;
      },
      async () => {},
      {
        action: "save",
        acting: "saving",
        text: "Are you sure you want to save this dance to your personal module storage? None of its dependencies will be saved, you will have to save them separately if you want to avoid losing them.",
        item: post.content?.title,
        confirmColor: "blue",
      }
    );
  }
}

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
    </div>
    <button on:click={handleSaveDance}><Download color={"blue"} /></button>
    <button on:click={copyDanceLink}><ClipboardOutline color={"blue"} /></button>
    {#if post.ref?.match($currentUserId)}
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