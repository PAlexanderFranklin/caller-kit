<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import DanceGraph from "/src/lib/Components/Common/DanceGraph/DanceGraph.svelte";
import SelectedCall from "./SelectedCall.svelte";
import DanceOptions from "/src/lib/Components/Common/DanceGraph/DanceOptions.svelte";

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
    $viewedDance.selection = {group: 0, call: 0, delay: false};
  }
}

</script>

<div class="DanceViewer">
  <DanceGraph />
  <div class="InfoPanel">
    <DanceOptions />
    <SelectedCall />
  </div>
</div>

<style>
  .DanceViewer {
    display: flex;
    width: 100%;
  }
  .InfoPanel {
    width: 40rem;
  }
</style>