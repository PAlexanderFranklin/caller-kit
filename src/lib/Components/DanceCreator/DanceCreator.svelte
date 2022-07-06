<script>
import { onMount, setContext } from "svelte";

import { writable } from "svelte/store";
import { calls, createDance, updateDance } from '/src/lib/utils/danceModule';
import CallList from "./Calls/CallList.svelte";
import DanceGraph from "./DanceGraph/DanceGraph.svelte";
import SelectedCall from "./Dance/SelectedCall.svelte";
import ConfirmModal from "./ConfirmModal.svelte";
import DanceOptions from "./Dance/DanceOptions.svelte";

let showModal = false;

export let dance = false;

let closeModal = () => {
  showModal = false;
};

let confirmModal = () => {
  showModal = false;
};

const modalDetails = writable({
    action: "delete",
    noun: "call",
    item: "a",
    confirmColor: "blue",
});
setContext('modalDetails', modalDetails);

async function openModal(confirm, cancel, details) {
  $modalDetails = details;
  confirmModal = () => {
    confirm()
    showModal = false
  }
  closeModal = () => {
    cancel()
    showModal = false
  }
  showModal = true;
}

setContext('openModal', openModal);

const newDance = writable({
  dance: {
    instructions: [
      []
    ]
  },
  selection: {group: 0, call: 0, delay: true},
  duration: 0,
  saving: false,
});
setContext("newDance", newDance)

function addCall(call) {
  $newDance.dance.instructions[$newDance.selection.group].splice(
    $newDance.selection.call + ($newDance.selection.delay ? 0 : 1), 0, {...call}
  );
  $newDance.dance.instructions = [...$newDance.dance.instructions];
  $newDance.selection = {...$newDance.selection, call: $newDance.selection.call + ($newDance.selection.delay ? 0 : 1), delay: false};
}

function removeCall(group, callIndex) {
  $newDance.dance.instructions[group].splice(
    callIndex, 1
  );
  $newDance.dance.instructions = [...$newDance.dance.instructions];
}

function handleCreateDance() {
  $newDance.saving = true
  if ($newDance.dance.id) {
    updateDance($newDance.dance).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      $newDance.saving = false;
    })
  }
  else {
    createDance($newDance.dance).then((res) => {
      console.log(res);
      $newDance.dance = {
        ...$newDance.dance, id: res.dance.id
      };
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      $newDance.saving = false;
    })
  }
}

onMount(() => {
  if (dance) {
    $newDance.dance = {...dance};
  }
})

</script>

<button on:click={console.log($calls)}>Log Calls</button>
<div class="DanceCreator">
  <CallList
    calls={$calls}
    on:selectCall={(event) => {addCall(event.detail.call)}}
  />
  <DanceGraph
    on:removeCall={(event) => {removeCall(event.detail.groupIndex, event.detail.callIndex)}}
  />
  <div>
    <SelectedCall on:removeCall={(event) => {removeCall(event.detail.groupIndex, event.detail.callIndex)}} />
    <DanceOptions on:createDance={handleCreateDance} />
  </div>
</div>
{#if showModal}
<ConfirmModal
  on:closeModal={closeModal}
  on:confirm={confirmModal}
/>
{/if}

<style>
  .DanceCreator {
    display: flex;
  }
</style>