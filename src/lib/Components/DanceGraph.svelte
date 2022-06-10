<script>
import { getContext } from "svelte";

let calls = getContext("calls");
</script>

<div>
  {#each calls as part}
    <div class="dancePart"></div>
  {/each}
</div>

<style>
  .dancePart {
  }
</style>