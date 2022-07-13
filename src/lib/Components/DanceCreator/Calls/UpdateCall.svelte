<script>
import { createEventDispatcher, onMount, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { updateCall, calls } from '/src/lib/utils/danceModule';
import CallEditor from './CallEditor.svelte';

const dispatch = createEventDispatcher();

export let call = {};

const updatedCall = writable({
  title: "",
  text: "",
  beats: 8,
  isFootwork: false,
  isHold: false,
})
setContext("call", updatedCall)

const callingModule = writable(false);
setContext("callingModule", callingModule);

function handleUpdateCall() {
  $callingModule = true;
  updateCall($updatedCall).then((res) => {
    $calls = res.calls;
    dispatch('closeModal', {});
    $callingModule = false;
  }).catch((err) => {
    console.error(err);
    $callingModule = false;
  });
}

onMount(() => {
  $updatedCall = {...call};
})

</script>

<CallEditor verb="Updat" on:callModule={handleUpdateCall} on:closeModal={() => {dispatch('closeModal', {})}} />