<script>
// @ts-nocheck

	import { Router, Route, createHistory } from "svelte-navigator";
  import createHashSource from "./lib/utils/hashHistory.js";
  // import SkynetContextProvider from "./lib/utils/SkynetContextProvider.svelte";
  // import Login from "./lib/Components/Login.svelte";

  import * as kernel from "libkernel";

  import {
    IdentityDAC,
    ProfileDAC,
    SocialDAC,
    FeedDAC,
  } from "skynet-dacs-library";
  
  const hash = createHistory(createHashSource());

  // const identityDAC = new IdentityDAC();

  // const profileDAC = new ProfileDAC();
  // const socialDAC = new SocialDAC();
  // const feedDAC = new FeedDAC();

  let loading = true
  kernel.init().then(loading = false);

</script>

{#if loading}
  <div>The application is loading.</div>
{:else}
  <Router history={hash}>
    <!-- <SkynetContextProvider> -->
      <!-- <Route path="login" component={Login} /> -->

      <Route>
        <p>This is the default route.</p>
      </Route>
    <!-- </SkynetContextProvider> -->
  </Router>
{/if}

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  @media (min-width: 480px) {
  }
</style>
