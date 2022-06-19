<script>
import { writable } from "svelte/store";
import { calls } from '../utils/danceModule';
import CallList from "./Calls/CallList.svelte";

const mainCall = writable({});

</script>

<p>
  Title: {$mainCall.title}
</p>
<button on:click={console.log($calls)}>Log Calls</button>
<CallList calls={$calls} on:selectCall={(event) => {$mainCall = event.detail.call}} />
<!-- <CallList on:selectCall={(data) => {console.log(data)}} /> -->