<script>
import { onMount } from 'svelte';
import { getMusicByRef } from '/src/lib/utils/danceModule';

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

onMount(getMusic)

</script>

<div>
  {musicRef.title}:
  {#if getting}
  Loading...
  {:else if sourceMusic.link}
  <a href={sourceMusic.link}>{sourceMusic.link}</a>
  {/if}
</div>