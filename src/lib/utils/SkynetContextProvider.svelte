<script>
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import { init as kernelInit, loginComplete, openAuthWindow } from 'libkernel';

let userAuthStatus = writable(false);
let authInProgress = writable(false);

// on first load, check authentication status of user
// this also calls init()
$: checkAuthStatus();

const checkAuthStatus = async () => {
  $authInProgress = true;
  const result = await kernelInit();
  loginComplete().then($userAuthStatus = true);
  $authInProgress = false;
};

const login = async () => {
  $authInProgress = true;
  await openAuthWindow();
  await checkAuthStatus();
  $authInProgress = false;
};

setContext("skynetContext", {
  userAuthStatus,
  login,
  authInProgress,
})
</script>

{#if !$userAuthStatus}
  {#if $authInProgress}
    <div>The application is loading.</div>
  {:else}
    <button on:click={login}>Authenticate With Skynet Kernel</button>
  {/if}
{:else}
  <slot />
{/if}