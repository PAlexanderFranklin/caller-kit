<script>
  import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
  import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
  import CallInfo from './CallInfo.svelte';
  
  export let sourceCall = {};
  
  let showFootwork = false;
  let showHold = false;
  
  </script>
  
  {#if sourceCall?.footwork}
    <button on:click={() => {
      showFootwork = !showFootwork;
      showHold = false;
    }}>
      Footwork: {sourceCall.footwork.title}
      {#if showFootwork}
      <ChevronUp color={"blue"} />
      {:else}
      <ChevronDown color={"blue"} />
      {/if}
    </button>
  {/if}
  {#if sourceCall?.hold}
    <button on:click={() => {
      showHold = !showHold;
      showFootwork = false;
    }}>
      Hold: {sourceCall.hold.title}
      {#if showHold}
      <ChevronUp color={"blue"} />
      {:else}
      <ChevronDown color={"blue"} />
      {/if}
    </button>
  {/if}
  {#if showFootwork}
    <CallInfo callRef={sourceCall.footwork} />
  {/if}
  {#if showHold}
    <CallInfo callRef={sourceCall.hold} />
  {/if}