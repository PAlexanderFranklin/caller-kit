<script>
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import { init as kernelInit, loginComplete, openAuthWindow } from 'libkernel';
import { getState, calls, dances } from "./danceModule";

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

let subscribed = false;

const callGetState = () => {
  getState().then((result) => {
    $calls = result.calls;
    $dances = result.dances;
  })
  subscribed = true;
}

$: $userAuthStatus && !subscribed ? callGetState() : "";
</script>

{#if !$userAuthStatus}
  {#if $authInProgress}
    <div>Authenticating...</div>
  {:else}
    <button on:click={login}>Authenticate With Skynet Kernel</button>
  {/if}
{:else}
  <slot />
{/if}