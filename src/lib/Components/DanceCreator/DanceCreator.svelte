<script>
import { setContext } from "svelte";

import { writable } from "svelte/store";
import { calls } from '/src/lib/utils/danceModule';
import CallList from "./Calls/CallList.svelte";
import DanceGraph from "./DanceGraph/DanceGraph.svelte";
import SelectedCall from "./Dance/SelectedCall.svelte";

const newDance = writable({
  dance: {
    instructions: [
      [
        {id: 123, title: "polka", beats: 2},
        {id: 123, title: "polka", beats: 4, delay: 4},
        {id: 123, title: "polka", beats: 4, delay: 4},
        {beats: 20}
      ],
      [
        {beats: 3}, {beats: 4}
      ]
    ]
  },
  selection: {group: 0, call: 0, delay: true},
  duration: 0,
});
setContext("newDance", {newDance})

function addCall(call) {
  $newDance.dance.instructions[$newDance.selection.group].splice(
    $newDance.selection.call + ($newDance.selection.delay ? 0 : 1), 0, {...call}
  );
  $newDance.dance.instructions = [...$newDance.dance.instructions];
  $newDance.selection = {...$newDance.selection, call: $newDance.selection.call + ($newDance.selection.delay ? 0 : 1), delay: false};
}

</script>

<button on:click={console.log($calls)}>Log Calls</button>
<div class="DanceCreator">
  <CallList calls={$calls} on:selectCall={(event) => {addCall(event.detail.call)}} />
  <DanceGraph />
  <SelectedCall />
</div>

<style>
  .DanceCreator {
    display: flex;
  }
</style>