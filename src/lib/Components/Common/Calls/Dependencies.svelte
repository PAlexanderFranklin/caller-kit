<script>
  import { createEventDispatcher } from 'svelte';
import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
import ChevronUp from "svelte-material-icons/ChevronUp.svelte";
import CallInfo from './CallInfo.svelte';

export let source = {};

let showFootwork = false;
let showHold = false;

const dispatch = createEventDispatcher();

</script>

<div class="Dependencies">
{#if source?.footwork}
  {#if showFootwork}
    <button>
      Footwork: {source.footwork.title}
      <ChevronUp color={"blue"} />
    </button>
    <CallInfo
      callRef={source.footwork}
      on:closeInfo={() => {showFootwork = false; dispatch('setAllowClose', true)}}
      on:setAllowClose
    />
  {:else}
    <button on:click|preventDefault={() => {
      showFootwork = !showFootwork;
    }}>
      Footwork: {source.footwork.title}
      <ChevronDown color={"blue"} />
    </button>
  {/if}
{:else}
    <button>No Footwork</button>
{/if}
{#if source?.hold}
  {#if showHold}
    <button>
      Hold: {source.hold.title}
      <ChevronUp color={"blue"} />
    </button>
    <CallInfo
      callRef={source.hold}
      on:closeInfo={() => {showHold = false; dispatch('setAllowClose', true)}}
      on:setAllowClose
    />
  {:else}
    <button on:click|preventDefault={() => {
      showHold = !showHold;
    }}>
      Hold: {source.hold.title}
      <ChevronDown color={"blue"} />
    </button>
  {/if}
{:else}
    <button>No Hold</button>
{/if}
</div>

<style>
  .Dependencies {
    display: flex;
    gap: 1rem;
  }
</style>