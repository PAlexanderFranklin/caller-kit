<script>
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

const dataDomain = 'callerkit.hns';
</script>


<slot />