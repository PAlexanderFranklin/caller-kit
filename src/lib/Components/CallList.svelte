<script>
  import { calls } from "../utils/danceModule";
  import CreateCall from "./CreateCall.svelte";

  let hidden = true;
</script>

<div>
  {#if hidden}
    <button on:click={() => {hidden = false}}>New Call</button>
  {:else}
    <CreateCall />
  {/if}
  {#each $calls as call}
    <h1>
      Name: {call.title}
    </h1>
    <p>
      Description: {call.text}
    </p>
    <span>
      Duration in Beats: {call.beats}
    </span>
  {/each}
</div>