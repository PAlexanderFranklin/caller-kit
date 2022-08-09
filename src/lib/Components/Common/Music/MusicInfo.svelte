<script>
import { onMount } from 'svelte';
import { musicList, getMusicByRef, insertMusic, updateMusic } from '/src/lib/utils/danceModule';
import Download from "svelte-material-icons/Download.svelte";

export let musicRef = {};

let sourceMusic = {};
let getting = false;

async function getMusic() {
  getting = true;
  try {
    const res = await getMusicByRef(musicRef);
    if (res.music) {
      sourceMusic = res.music;
    }
  }
  catch (err) {
    console.log(err);
    sourceMusic = {}
  }
  getting = false;
}

async function handleSaveMusic() {
  let userMusic;
  try {
    const res = await getMusicByRef({id: sourceMusic.id});
    userMusic = res.music;
  } catch (error) {
    userMusic = null;
  }
  if (userMusic) {
    openModal(
      async () => {
        const res = await updateMusic(sourceMusic);
        $musicList = res.musicList;
        return res;
      },
      async () => {},
      {
        action: "overwrite",
        acting: "overwriting",
        text: "A music with the same id was found in your personal storage! \n If you save this music, it will overwrite the version in your personal storage, are you sure you want to do that?",
        item: `Title: New: ${sourceMusic.title}, Old: ${userMusic.title} \n Id: ${sourceMusic.id}`,
        confirmColor: "red",
      }
    );
  }
  else {
    openModal(
      async () => {
        const res = await insertMusic(sourceMusic);
        $musicList = res.musicList;
        return res;
      },
      async () => {},
      {
        action: "save",
        acting: "saving",
        text: "Are you sure you want to save this music to your personal module storage? None of its dependencies will be saved, you will have to save them separately if you want to avoid losing them.",
        item: sourceMusic.title,
        confirmColor: "blue",
      }
    );
  }
}

onMount(getMusic)

</script>

<div>
  {musicRef.title}:
  {#if getting}
  Loading...
  {:else if sourceMusic.link}
  <a href={sourceMusic.link}>{sourceMusic.link}</a>
  {/if}
  {#if sourceMusic && sourceMusic.skyfeed}
    <button on:click={handleSaveMusic}><Download color={"blue"} /></button>
  {/if}
</div>