<script>
import { createEventDispatcher, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { createMusic, musicList } from '/src/lib/utils/danceModule';
import MusicEditor from './MusicEditor.svelte';
  
const dispatch = createEventDispatcher();

const music = writable({
  title: "",
  link: "",
})

setContext("music", music)

const callingModule = writable(false);
setContext("callingModule", callingModule);

function handleCreateMusic() {
  $callingModule = true;
  createMusic($music).then((result) => {
    $musicList = [...$musicList, result.music];
    dispatch('closeModal', {});
    $callingModule = false;
  }).catch((err) => {
    console.error(err);
    $callingModule = false;
  });
}
</script>

<MusicEditor verb="Creat" on:callModule={handleCreateMusic} on:closeModal={() => {dispatch('closeModal', {})}} />