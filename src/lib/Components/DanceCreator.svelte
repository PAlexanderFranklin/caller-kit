<script>
import { writable } from "svelte/store";
import CallList from "./Calls/CallList.svelte";

const mainCall = writable({});

</script>

<p>
  Title: {$mainCall.title}
</p>
<CallList on:selectCall={(event) => {$mainCall = event.detail.call}} />
<!-- <CallList on:selectCall={(data) => {console.log(data)}} /> -->