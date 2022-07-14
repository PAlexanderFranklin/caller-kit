<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import { calls, dances, createDance, updateDance } from '/src/lib/utils/danceModule';
import CallList from "./Calls/CallList.svelte";
import DanceGraph from "./DanceGraph/DanceGraph.svelte";
import SelectedCall from "./Dance/SelectedCall.svelte";
import DanceOptions from "./Dance/DanceOptions.svelte";

export let dance = false;

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
    $newDance.selection.call + ($newDance.selection.delay ? 0 : 1),
    0,
    {
      id: call.id,
      title: call.title,
      skyfeed: call.skyfeed,
      beats: call.beats,
    }
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
      $dances = res.dances;
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      $newDance.saving = false;
    })
  }
  else {
    createDance($newDance.dance).then((res) => {
      $dances = [...$dances, res.dance];
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

$: {
  if (dance) {
    $newDance.dance = {...dance};
    $newDance.selection = {group: 0, call: 0, delay: true};
  }
}

</script>

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

<style>
  .DanceCreator {
    display: flex;
  }
</style>