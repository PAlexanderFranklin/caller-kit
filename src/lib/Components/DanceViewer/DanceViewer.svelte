<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import DanceGraph from "/src/lib/Components/Common/DanceGraph/DanceGraph.svelte";
import SelectedCall from "./SelectedCall.svelte";
import DanceOptions from "./DanceOptions.svelte";

export let dance = false;

const viewedDance = writable({
  dance: {
    instructions: [
      []
    ]
  },
  selection: {group: 0, call: 0, delay: true},
  duration: 0,
  editing: false,
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