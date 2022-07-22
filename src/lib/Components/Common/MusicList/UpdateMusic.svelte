<script>
import { createEventDispatcher, onMount, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { updateMusic, musicList } from '/src/lib/utils/danceModule';
import MusicEditor from './MusicEditor.svelte';

const dispatch = createEventDispatcher();

export let music = {};

const updatedMusic = writable({
  title: "",
  text: "",
  beats: 8,
  isFootwork: false,
  isHold: false,
})
setContext("music", updatedMusic)

const callingModule = writable(false);
setContext("callingModule", callingModule);

function handleUpdateMusic() {
  $callingModule = true;
  updateMusic($updatedMusic).then((res) => {
    $musicList = res.musicList;
    dispatch('closeModal', {});
    $callingModule = false;
  }).catch((err) => {
    console.error(err);
    $callingModule = false;
  });
}

onMount(() => {
  $updatedMusic = {...music};
})

</script>

<MusicEditor verb="Updat" on:musicModule={handleUpdateMusic} on:closeModal={() => {dispatch('closeModal', {})}} />