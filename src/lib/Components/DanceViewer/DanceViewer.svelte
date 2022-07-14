<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import DanceGraph from "./DanceGraph/DanceGraph.svelte";
import SelectedCall from "./Dance/SelectedCall.svelte";
import DanceOptions from "./Dance/DanceOptions.svelte";

export let dance = false;

const viewedDance = writable({
  dance: {
    instructions: [
      []
    ]
  },
  selection: {group: 0, call: 0, delay: true},
});
setContext("viewedDance", viewedDance)

$: {
  if (dance) {
    $viewedDance.dance = {...dance};
    $viewedDance.selection = {group: 0, call: 0, delay: true};
  }
}

</script>

<div class="DanceCreator">
  <DanceGraph />
  <div>
    <SelectedCall />
    <DanceOptions />
  </div>
</div>

<style>
  .DanceCreator {
    display: flex;
  }
</style>