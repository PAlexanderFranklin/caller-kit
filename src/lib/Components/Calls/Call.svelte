<script>
import { createEventDispatcher } from 'svelte';

export let call;
  
const dispatch = createEventDispatcher();
</script>

<div>
  <div>
    Name: {call.title}
    <span on:click={() => {dispatch('selectCall', { call })}}>select</span>
  </div>
  <p>
    Description: {call.text}
  </p>
  <span>
    Duration in Beats: {call.beats}
  </span>
</div>