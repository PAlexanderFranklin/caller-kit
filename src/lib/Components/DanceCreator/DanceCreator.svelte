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
      // Each of these arrays need to be a component that can tell the parent to do stuff to the component.
      [
        // Each of these objects needs to be a component that can be told it is selected (for styling)
        // and can tell the parent component it is selected (by being clicked on)
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
  groupIndex: 0,
});
setContext("newDance", {newDance})

function addCall(call) {
  $newDance.dance.instructions[$newDance.selection.group].splice(
    $newDance.selection.call + ($newDance.selection.delay ? 0 : 1), 0, {...call}
  );
  $newDance.dance.instructions = [...$newDance.dance.instructions];
  $newDance.selection = {...$newDance.selection, call: $newDance.selection.call + ($newDance.selection.delay ? 0 : 1), delay: false};
}

$: $newDance.groupIndex = 0;

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