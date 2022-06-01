<script>
// @ts-nocheck

	import { Router, Route, createHistory } from "svelte-navigator";
  import createHashSource from "./lib/utils/hashHistory.js";
  import SkynetContextProvider from "./lib/utils/SkynetContextProvider.svelte";
  import Login from "./lib/Components/Login.svelte";
  
  const hash = createHistory(createHashSource());
</script>

<Router history={hash}>
  <SkynetContextProvider>
    <Route path="login" component={Login} />

    <Route>
      <p>This is the default route.</p>
    </Route>
  </SkynetContextProvider>
</Router>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  @media (min-width: 480px) {
  }
</style>
