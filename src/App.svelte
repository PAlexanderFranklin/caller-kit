<script>
// @ts-nocheck

	import { Router, Route, createHistory } from "svelte-navigator";
  import createHashSource from "./lib/utils/hashHistory.js";
  // import Login from "./lib/Components/Login.svelte";

  import * as kernel from "libkernel";
  import CreateCall from "./lib/Components/CreateCall.svelte";
  
  const hash = createHistory(createHashSource());

  let loading = true
  kernel.init().then(
    loading = false
  );

</script>

{#if loading}
  <div>The application is loading.</div>
{:else}
  <Router history={hash}>
    <!-- <SkynetContextProvider> -->
      <!-- <Route path="login" component={Login} /> -->

      <Route>
        <p>All content created using this application is published in the public domain under the <a rel="license"
          href="http://creativecommons.org/publicdomain/zero/1.0/">Creative Commons Zero License</a> unless otherwise specified.</p>
        <CreateCall />
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
