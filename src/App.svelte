<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import { Router, Route, createHistory } from "svelte-navigator";
import { dances } from '/src/lib/utils/danceModule';
import createHashSource from "/src/lib/utils/hashHistory.js";
import SkynetContextProvider from "/src/lib/utils/SkynetContextProvider.svelte";
import DanceCreator from "/src/lib/Components/DanceCreator/DanceCreator.svelte";
import ConfirmModal from "/src/lib/Components/Common/ConfirmModal.svelte";
import DanceList from "/src/lib/Components/DanceList/DanceList.svelte";
import DanceViewer from "/src/lib/Components/DanceViewer/DanceViewer.svelte";
  
const hash = createHistory(createHashSource());

let showDanceCreator = false;
let showDanceList = true;
let selectedDance = null;

const danceToEdit = writable({
  dance: {
    instructions: [
      []
    ],
    music: [],
  },
  selection: {group: 0, call: 0, delay: true},
  duration: 0,
  saving: false,
  editing: true,
});
setContext("danceToEdit", danceToEdit);

function hideComponents() {
  showDanceCreator = false;
  showDanceList = false;
  selectedDance = null
}

function editDance(dance) {
  $danceToEdit = {
    dance: {
      instructions: [
        []
      ],
      music: [],
      ...dance
    },
    selection: {group: 0, call: 0, delay: true},
    duration: 0,
    saving: false,
    editing: true,
  };
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
    confirm().catch((err) => {
      console.error(err);
    }).finally(() => {
      showModal = false
      $modalDetails = {...details, acting: null};
    })
  }
  closeModal = () => {
    cancel().finally(() => {
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
        <button on:click={() => {hideComponents(); showDanceList = true}}>Close Editor</button>
        {:else}
        <button on:click={() => {hideComponents(); showDanceCreator = true}}>Open Editor</button>
        <button on:click={() => {hideComponents(); editDance({})}}>Create a New Dance</button>
        {/if}
        {#if showDanceList}
        <DanceList
          dances={$dances}
          on:editDance={(event) => {hideComponents(); editDance(event.detail.dance);}}
          on:selectDance={(event) => {selectedDance = event.detail.dance}}
        />
        {/if}
        {#if selectedDance}
        <DanceViewer dance={selectedDance} />
        {/if}
        {#if showDanceCreator}
        <DanceCreator on:save={() => {hideComponents(); showDanceList = true}} />
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
