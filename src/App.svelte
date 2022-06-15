<script>
import { Router, Route, createHistory } from "svelte-navigator";
import createHashSource from "./lib/utils/hashHistory.js";
import CreateCall from "./lib/Components/CreateCall.svelte";
import SkynetContextProvider from "./lib/utils/SkynetContextProvider.svelte";
  
const hash = createHistory(createHashSource());

</script>

<SkynetContextProvider>
    <Router history={hash}>
      <!-- <Route path="login" component={Login} /> -->

      <Route>
        <p>All content created using this application is published in the public domain under the <a rel="license"
          href="http://creativecommons.org/publicdomain/zero/1.0/">Creative Commons Zero License</a> unless otherwise specified.</p>
        <CreateCall />
      </Route>
    </Router>
</SkynetContextProvider>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  @media (min-width: 480px) {
  }
</style>
