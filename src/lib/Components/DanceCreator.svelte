<script>
import { setContext } from "svelte";

import { writable } from "svelte/store";
import { calls } from '../utils/danceModule';
import CallList from "./Calls/CallList.svelte";
import DanceGraph from "./DanceGraph.svelte";

const mainCall = writable({});

const newDance = writable({dance: {instructions: [[{beats: 2}, {beats: 4}, {beats: 20}], [{beats: 3}, {beats: 4}]]}, selection: {group: "main", callIndex: 0}});
setContext("newDance", {newDance})

</script>

<p>
  Title: {$mainCall.title}
</p>
<button on:click={console.log($calls)}>Log Calls</button>
<CallList calls={$calls} on:selectCall={(event) => {$mainCall = event.detail.call}} />
<!-- <CallList on:selectCall={(data) => {console.log(data)}} /> -->
<DanceGraph />