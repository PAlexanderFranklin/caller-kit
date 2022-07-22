<script>
import { createEventDispatcher, getContext, setContext } from "svelte";
import { calls, dances, createDance, updateDance } from '/src/lib/utils/danceModule';
import CallList from "/src/lib/Components/Common/CallList/CallList.svelte";
import DanceGraph from "/src/lib/Components/Common/DanceGraph/DanceGraph.svelte";
import SelectedCall from "./SelectedCall.svelte";
import DanceOptions from "./DanceOptions.svelte";

const dispatch = createEventDispatcher();

const danceToEdit = getContext("danceToEdit");
const viewedDance = danceToEdit;
setContext("viewedDance", viewedDance);

function addCall(call) {
  $viewedDance.dance.instructions[$viewedDance.selection.group].splice(
    $viewedDance.selection.call + ($viewedDance.selection.delay ? 0 : 1),
    0,
    {
      id: call.id,
      title: call.title,
      skyfeed: call.skyfeed,
      beats: call.beats,
    }
  );
  $viewedDance.dance.instructions = [...$viewedDance.dance.instructions];
  $viewedDance.selection = {...$viewedDance.selection, call: $viewedDance.selection.call + ($viewedDance.selection.delay ? 0 : 1), delay: false};
}

function removeCall(group, callIndex) {
  $viewedDance.dance.instructions[group].splice(
    callIndex, 1
  );
  $viewedDance.dance.instructions = [...$viewedDance.dance.instructions];
}

function handleCreateDance() {
  $viewedDance.saving = true
  if ($viewedDance.dance.id) {
    updateDance($viewedDance.dance).then((res) => {
      $dances = res.dances;
      dispatch('save');
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      $viewedDance.saving = false;
    })
  }
  else {
    createDance($viewedDance.dance).then((res) => {
      $dances = [...$dances, res.dance];
      $viewedDance.dance = {
        ...$viewedDance.dance, id: res.dance.id
      };
      dispatch('save');
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      $viewedDance.saving = false;
    })
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