<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import { Router, Route, createHistory } from "svelte-navigator";
import createHashSource from "./lib/utils/hashHistory.js";
import SkynetContextProvider from "./lib/utils/SkynetContextProvider.svelte";
import DanceCreator from "./lib/Components/DanceCreator/DanceCreator.svelte";
import ConfirmModal from "./lib/Components/common/ConfirmModal.svelte";
  
const hash = createHistory(createHashSource());

let editingDance = {instructions: [[]]};
let showDanceCreator = false;

function hideComponents() {
  showDanceCreator = false;
}

function editDance(dance) {
  editingDance = dance;
  showDanceCreator = true;
}

let showModal = false;

let closeModal = () => {
  showModal = false;
};

let confirmModal = () => {
  showModal = false;
};

const modalDetails = writable({
    action: "delete",
    acting: "deleting",
    noun: "call",
    item: "a",
    confirmColor: "blue",
});
setContext('modalDetails', modalDetails);

async function openModal(confirm, cancel, details) {
  $modalDetails = {...details, acting: null};
  confirmModal = () => {
    $modalDetails.acting = details.acting;
    confirm().then(() => {
      showModal = false
    }).finally(() => {
      $modalDetails = {...details, acting: null};
    })
  }
  closeModal = () => {
    cancel().then(() => {
      showModal = false
    })
  }
  showModal = true;
}

setContext('openModal', openModal);

</script>

<SkynetContextProvider>
    <Router history={hash}>
      <!-- <Route path="login" component={Login} /> -->

      <Route>
        <h1>Caller Kit</h1>
        <p>All content created using this application is published in the public domain under the <a rel="license"
          href="http://creativecommons.org/publicdomain/zero/1.0/">Creative Commons Zero License</a> unless otherwise specified.
        </p>
        {#if showDanceCreator}
        <button on:click={() => {hideComponents()}}>Close Editor</button>
        {:else}
        <button on:click={() => {hideComponents(); showDanceCreator = true}}>Open Editor</button>
        <button on:click={() => {hideComponents(); editDance({instructions: [[]]})}}>Create a New Dance</button>
        {/if}
        {#if showDanceCreator}
        <DanceCreator dance={editingDance} />
        {/if}
      </Route>
    </Router>
    {#if showModal}
    <ConfirmModal
      on:closeModal={closeModal}
      on:confirm={confirmModal}
    />
    {/if}
</SkynetContextProvider>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  @media (min-width: 480px) {
  }
</style>
