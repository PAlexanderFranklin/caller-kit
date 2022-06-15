<script>
import { writable, setContext } from "svelte/store";
import { init as kernelInit, openAuthWindow } from 'libkernel';

let userAuthStatus = writable(false)
let authInProgress = writable(false)

// on first load, check authentication status of user
// this also calls init()
$: checkAuthStatus();

const checkAuthStatus = async () => {
  $authInProgress = true;
  const result = await kernelInit();
  result ? $userAuthStatus = false : $userAuthStatus = true;
  $authInProgress = false;
};

const login = async () => {
  $authInProgress = true;
  await openAuthWindow();
  checkAuthStatus();
  $authInProgress = false;
};

setContext("skynetContext", {
  userAuthStatus,
  login,
  authInProgress,
})
</script>


<slot />