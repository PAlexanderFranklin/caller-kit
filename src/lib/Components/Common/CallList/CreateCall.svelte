<script>
import { createEventDispatcher, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { createCall, calls } from '/src/lib/utils/danceModule';
import CallEditor from './CallEditor.svelte';
  
const dispatch = createEventDispatcher();

const call = writable({
  title: "",
  text: "",
  beats: 8,
  isFootwork: false,
  isHold: false,
})

setContext("call", call)

const callingModule = writable(false);
setContext("callingModule", callingModule);

function handleCreateCall() {
  $callingModule = true;
  createCall($call).then((result) => {
    $calls = [...$calls, result.call];
    dispatch('closeModal', {});
    $callingModule = false;
  }).catch((err) => {
    console.error(err);
    $callingModule = false;
  });
}
</script>

<CallEditor verb="Creat" on:callModule={handleCreateCall} on:closeModal={() => {dispatch('closeModal', {})}} />