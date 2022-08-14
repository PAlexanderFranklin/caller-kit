<script>
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import { init as kernelInit, loginComplete, openAuthWindow } from 'libkernel';
import { IdentityDAC, PermissionDAC } from "skynet-dacs-library";
import { getState, calls, dances, musicList } from "./danceModule";

const identityDAC = new IdentityDAC();
const permissionDAC = new PermissionDAC();

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
    $musicList = result.musicList;
  })
  subscribed = true;
}

$: $userAuthStatus && !subscribed ? callGetState() : "";

let permissionsGranted = false;
let ungrantedPermissions = [];

async function checkPermissions() {
  ungrantedPermissions = await permissionDAC.checkPermissions([
    "feed-dac.hns/post/create/feed/dances",
    "feed-dac.hns/post/create/feed/danceCalls",
    "feed-dac.hns/post/create/feed/danceMusic",
  ]);
  if (ungrantedPermissions.length > 0) {
    permissionsGranted = false;
  }
  else {
    permissionsGranted = true;
  }
}

$: checkPermissions();

function grantPermissions() {
  if (ungrantedPermissions.length > 0) {
    let req = {
      domain: "callerkit.hns", // your app domain
      permissions: ungrantedPermissions,
    };
    const w = 640;
    const h = 750;
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    const newWindow = window.open(
      "https://auth.solver.red/#" +
        btoa(JSON.stringify(req)).replace("/", "_").replace("+", "-"),
      "Grant permissions",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
    );
    if (newWindow.focus) {
      newWindow.focus();
    }
    if (newWindow) {
      newWindow.addEventListener('beforeunload', (event) => {
        console.log(newWindow?.closed);
        if (newWindow?.closed) {
          checkPermissions();
        }
      })
    }
  }
}

const currentUserId = writable("");
setContext('currentUserId', currentUserId);

$: if (permissionsGranted) {
  identityDAC.userID().then((id) => {$currentUserId = id})
}

// Skyfeed Code

let routeUserId = writable(null);
setContext("routeUserId", routeUserId);
let routeDanceSkyfeed = writable(null);
setContext("routeDanceSkyfeed", routeDanceSkyfeed);

function updateHash () {
  let [hash, asset, ...address] = window.location.hash.split('/');
  let data = address.join('/');
  if (asset === "user") {
    $routeUserId = data;
    $routeDanceSkyfeed = null;
  } else if (asset === "dance") {
    $routeUserId = null;
    $routeDanceSkyfeed = data;
  } else {
    $routeUserId = null;
    $routeDanceSkyfeed = null;
  }
}
updateHash();

window.onhashchange = function (event) {
  updateHash();
}

</script>

{#if !$userAuthStatus}
  {#if $authInProgress}
    <div>Authenticating...</div>
  {:else}
    <button on:click={login}>Authenticate With Skynet Kernel</button>
  {/if}
{:else if !permissionsGranted}
  <button on:click={grantPermissions}>Grant Dance Feed Permissions</button>
{:else}
  <slot />
{/if}