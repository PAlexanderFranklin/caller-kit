<script>
import { onMount } from 'svelte';
import { getCallByRef } from '/src/lib/utils/danceModule';
import CallDependencies from './CallDependencies.svelte';

export let callRef = {};

let sourceCall = {};

async function getCall() {
  try {
    const res = await getCallByRef(callRef);
    if (res.call) {
      sourceCall = res.call;
    }
  }
  catch (err) {
    console.log(err);
    sourceCall = {}
  }
}

onMount(getCall)

</script>

<div>
  <div class="CallInfo">
    <h4>Name: {sourceCall.title}</h4>
    <div>Duration in Beats: {sourceCall.beats}</div>
    <p>Description: {sourceCall?.text || ""}</p>
    <CallDependencies sourceCall={sourceCall} />
  </div>
</div>

<style>
  .CallInfo {
    position: absolute;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 20rem;
    background-color: white;
    border: 2px black solid;
  }
</style>