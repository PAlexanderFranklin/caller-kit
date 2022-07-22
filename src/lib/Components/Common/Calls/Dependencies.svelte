<script>
  import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
  import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
  import CallInfo from './CallInfo.svelte';
  
  export let source = {};
  
  let showFootwork = false;
  let showHold = false;
  
  </script>
  
  {#if source?.footwork}
    <button on:click={() => {
      showFootwork = !showFootwork;
      showHold = false;
    }}>
      Footwork: {source.footwork.title}
      {#if showFootwork}
      <ChevronUp color={"blue"} />
      {:else}
      <ChevronDown color={"blue"} />
      {/if}
    </button>
  {/if}
  {#if source?.hold}
    <button on:click={() => {
      showHold = !showHold;
      showFootwork = false;
    }}>
      Hold: {source.hold.title}
      {#if showHold}
      <ChevronUp color={"blue"} />
      {:else}
      <ChevronDown color={"blue"} />
      {/if}
    </button>
  {/if}
  {#if showFootwork}
    <CallInfo callRef={source.footwork} />
  {/if}
  {#if showHold}
    <CallInfo callRef={source.hold} />
  {/if}