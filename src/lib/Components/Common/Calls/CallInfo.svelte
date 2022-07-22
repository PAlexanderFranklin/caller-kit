<script>
import { onMount } from 'svelte';
import { getCallByRef } from '/src/lib/utils/danceModule';
import CallDependencies from './Dependencies.svelte';

export let callRef = {};

let sourceCall = {};
let getting = false;

async function getCall() {
  getting = true;
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
  getting = false;
}

onMount(getCall)

</script>

<div>
  <div class="CallInfo">
    <h4>Name: {getting ? "Loading..." : sourceCall.title || ""}</h4>
    <div>Duration in Beats: {getting ? "Loading..." : sourceCall.beats || ""}</div>
    {#if sourceCall?.text || getting}
    <p>Description: {getting ? "Loading..." : sourceCall?.text || ""}</p>
    {/if}
    {#if !getting}
    <CallDependencies sourceCall={sourceCall} />
    {/if}
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