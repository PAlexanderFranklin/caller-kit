<script>
import { createEventDispatcher, getContext, onMount } from 'svelte';
import { clickOutside } from "/src/lib/utils/clickOutside";
import { calls, getCallByRef, insertCall, updateCall } from '/src/lib/utils/danceModule';
import Dependencies from './Dependencies.svelte';
import Download from "svelte-material-icons/Download.svelte";

export let callRef = {};

const openModal = getContext("openModal");

let sourceCall = {};
let getting = false;
let getError = false;
let allowClose = true;

const dispatch = createEventDispatcher();

function setAllowClose(allow) {
  allowClose = allow;
  dispatch('setAllowClose', allow)
}

async function getCall() {
  getting = true;
  getError = false;
  try {
    const res = await getCallByRef(callRef);
    if (res.call) {
      sourceCall = res.call;
    }
  }
  catch (err) {
    console.log(err);
    sourceCall = {}
    getError = true;
  }
  getting = false;
}

async function handleSaveCall() {
  setAllowClose(false);
  let userCall;
  try {
    const res = await getCallByRef({id: sourceCall.id});
    userCall = res.call;
  } catch (error) {
    userCall = null;
  }
  if (userCall) {
    openModal(
      async () => {
        const res = await updateCall(sourceCall);
        $calls = res.calls;
        return res;
      },
      async () => {
        setAllowClose(true);
      },
      {
        action: "overwrite",
        acting: "overwriting",
        text: "A call with the same id was found in your personal storage! \n If you save this call, it will overwrite the version in your personal storage, are you sure you want to do that?",
        item: `Title: New: ${sourceCall.title}, Old: ${userCall.title} \n Id: ${sourceCall.id}`,
        confirmColor: "red",
      }
    );
  }
  else {
    openModal(
      async () => {
        const res = await insertCall(sourceCall);
        $calls = res.calls;
        return res;
      },
      async () => {
        setAllowClose(true);
      },
      {
        action: "save",
        acting: "saving",
        text: "Are you sure you want to save this call to your personal module storage? None of its dependencies will be saved, you will have to save them separately if you want to avoid losing them.",
        item: sourceCall.title,
        confirmColor: "blue",
      }
    );
  }
}

onMount(getCall)

</script>

<div class="AbsoluteContainer">
  <div class="CallInfo" use:clickOutside on:clickOutside={() => {allowClose ? dispatch('closeInfo') : ""}}>
    <button on:click={() => {dispatch('closeInfo')}}>X</button>
    {#if getError}
      <p>
        This call failed to fetch any information. This could be because
        either your internet or Skynet is not working properly, but it
        could also be because the call it references has been deleted.
        If the latter is the case, you should replace this call on this
        dance.
      </p>
    {:else if sourceCall && sourceCall.skyfeed}
      <button on:click={handleSaveCall}><Download color={"blue"} /></button>
    {/if}
    <h4>Name: {getting ? "Loading..." : sourceCall.title || ""}</h4>
    <div>Duration in Beats: {getting ? "Loading..." : sourceCall.beats || ""}</div>
    {#if sourceCall?.text || getting}
    <p>Description: {getting ? "Loading..." : sourceCall?.text || ""}</p>
    {/if}
    {#if !getting}
    <Dependencies source={sourceCall} on:setAllowClose={(event) => {setAllowClose(event.detail)}} />
    {/if}
  </div>
</div>

<style>
  .AbsoluteContainer {
    position: absolute;
    z-index: 2;
  }
  .CallInfo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 20rem;
    background-color: white;
    border: 2px black solid;
  }
</style>