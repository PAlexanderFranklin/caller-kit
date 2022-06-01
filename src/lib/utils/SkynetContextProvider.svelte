<script>
// @ts-nocheck

  import { writable } from 'svelte/store'
  import { onDestroy, setContext } from 'svelte'
  import { SkynetClient } from 'skynet-js';
  
  // To import DAC, uncomment here, and 2 spots below.
  // import { ContentRecordDAC } from '@skynetlabs/content-record-library';
  // import { UserProfileDAC } from '@skynethub/userprofile-library';
  // import { FileSystemDAC } from "fs-dac-library";

  // We'll define a portal to allow for developing on localhost.
  // When hosted on a skynet portal, SkynetClient doesn't need any arguments.
  const portal =
    window.location.hostname === 'localhost' ? 'https://fileportal.org' : undefined;

  // Initiate the SkynetClient
  const client = new SkynetClient(portal);

  // For now, we won't use any DACs -- uncomment to create
  // const contentRecord = new ContentRecordDAC();
  // const userProfile = new UserProfileDAC();
  // const fileSystem = new FileSystemDAC();

  const dataDomain = 'callerkit.hns';

  const state = writable({
    client,
    dataDomain,
    mySky: null,
    user: null,
  });

  async function initMySky() {
    try {
      // load invisible iframe and define app's data domain
      // needed for permissions write
      const mySky = await client.loadMySky(dataDomain);

      // load necessary DACs and permissions
      // Uncomment line below to load DACs
      // await mySky.loadDacs(contentRecord);
      // await mySky.loadDacs(userProfile);
      // await mySky.loadDacs(fileSystem);

      // replace mySky in state object
      $state = { ...$state, mySky };

      try {
        const isAuthenticated = await mySky.checkLogin();

        if (isAuthenticated) {
          const user = await mySky.userID();
          $state = { ...$state, user };
        }
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  }

  $: !$state.mySky && !$state.mySkyInitialising ? initMySky() : "";

  onDestroy(() => {
    if ($state.mySky) {
      $state.mySky.destroy();
    }
  });

  /* Everything in this comment block is old React code of mine.

  const authenticate = useCallback(() => {
    const execute = async () => {
      const success = await state.mySky.requestLoginAccess();

      if (success) {
        const user = await state.mySky.userID();

        setState((state) => ({ ...state, user, authenticating: false }));
      } else {
        setState((state) => ({ ...state, authenticating: false }));
      }
    };

    if (state.mySky && !state.authenticating) {
      setState((state) => ({ ...state, authenticating: true }));
      execute();
    }
  }, [state]);

  const logout = useCallback(() => {
    if (state.mySky) {
      state.mySky.logout();

      setState((state) => ({ ...state, user: null }));
    }
  }, [state]);

  */

</script>


<slot />