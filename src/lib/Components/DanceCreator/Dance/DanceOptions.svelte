<script>
import { createEventDispatcher, getContext } from "svelte";

const dispatch = createEventDispatcher();

const newDance = getContext("newDance")

</script>

<div class="DanceOptions">
  <button on:click={() => {dispatch("createDance")}}>Save</button>
</div>

<style>
  .DanceOptions {
    border: black solid 2px;
  }
</style>