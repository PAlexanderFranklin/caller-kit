<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import { dances } from '/src/lib/utils/danceModule';
import SkynetContextProvider from "/src/lib/utils/SkynetContextProvider.svelte";
import DanceCreator from "/src/lib/Components/DanceCreator.svelte";
import ConfirmModal from "/src/lib/Components/Common/ConfirmModal.svelte";
import DanceList from "/src/lib/Components/DanceList/DanceList.svelte";
import DanceFeed from "/src/lib/Components/DanceFeed/DanceFeed.svelte";
import DanceViewer from "/src/lib/Components/DanceViewer.svelte";

let showDanceCreator = false;
let showDanceList = false;
let showDanceFeed = true;
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
  showDanceFeed = false;
  selectedDance = null
}

function editDance(dance) {
  $danceToEdit = {
    dance: {
      instructions: [
        []
      ],
      music: [],
      ...JSON.parse(JSON.stringify(dance))
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
  closeModal();
};

const modalDetails = writable({
    action: "delete",
    acting: "deleting",
    text: "Are you sure you want to delete this item?",
    item: "Item 1",
    confirmColor: "blue",
});
setContext('modalDetails', modalDetails);

async function openModal(confirm, cleanUp, details) {
  $modalDetails = {...details, acting: null};
  closeModal = () => {
    cleanUp().finally(() => {
      showModal = false
    })
  }
  confirmModal = () => {
    $modalDetails.acting = details.acting;
    confirm().then(() => {
      closeModal();
    }).catch((err) => {
      $modalDetails = {
        ...details,
        action: "Ok",
        text: `Something went wrong, here's the error: ${err}`,
        confirmColor: "blue",
      };
      confirmModal = () => {closeModal()};
    }).finally(() => {
      $modalDetails = {...$modalDetails, acting: null};
    })
  }
  showModal = true;
}

setContext('openModal', openModal);

</script>

<SkynetContextProvider>
    <h1>Caller Kit</h1>
    <p>All content created using this application is published in the public domain under the <a rel="license"
      href="http://creativecommons.org/publicdomain/zero/1.0/">Creative Commons Zero License</a> unless otherwise specified.
    </p>
    {#if showDanceCreator}
    <button on:click={() => {hideComponents(); showDanceList = true}} class:selectedPage={showDanceCreator}>Close Editor</button>
    {:else}
    <button on:click={() => {hideComponents(); showDanceCreator = true}}>Open Editor</button>
    {/if}
    <button on:click={() => {hideComponents(); editDance({})}}>Create a New Dance</button>
    <button on:click={() => {hideComponents(); showDanceList = true}} class:selectedPage={showDanceList}>My Dances</button>
    <button on:click={() => {hideComponents(); showDanceFeed = true}} class:selectedPage={showDanceFeed}>Dance Feed</button>
    {#if showDanceList}
    <DanceList
      dances={$dances}
      on:editDance={(event) => {hideComponents(); editDance(event.detail.dance);}}
      on:selectDance={(event) => {selectedDance = event.detail.dance}}
    />
    {/if}
    {#if showDanceFeed}
    <DanceFeed
      on:selectDance={(event) => {selectedDance = event.detail.dance}}
    />
    {/if}
    {#if selectedDance}
    <DanceViewer dance={selectedDance} />
    {/if}
    {#if showDanceCreator}
    <DanceCreator on:save={() => {hideComponents(); showDanceList = true}} />
    {/if}
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
  .selectedPage {
    background-color: greenyellow;
  }

  @media (min-width: 480px) {
  }
</style>
