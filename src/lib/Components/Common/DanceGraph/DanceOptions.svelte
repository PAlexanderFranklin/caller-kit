<script>
import { createEventDispatcher, getContext } from "svelte";
import { calls, getCallByRef, musicList } from '/src/lib/utils/danceModule';
import CallList from "/src/lib/Components/Common/CallList/CallList.svelte";
import Close from "svelte-material-icons/Close.svelte";
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";
import MusicList from "/src/lib/Components/Common/MusicList/MusicList.svelte";
import MusicInfo from "/src/lib/Components/Common/Music/MusicInfo.svelte";

const dispatch = createEventDispatcher();

const viewedDance = getContext("viewedDance");
const openModal = getContext("openModal");

let selectingFootwork = false;
let selectingHold = false;
let selectingMusic = false;

function addMusic(music) {
  $viewedDance.dance.music = [
    ...$viewedDance.dance.music,
    {
      id: music.id,
      title: music.title,
      skyfeed: music.skyfeed,
    }
  ];
  selectingMusic = false;
}

async function updateDanceCalls() {
  openModal(
    async () => {
      $viewedDance.dance.instructions = await Promise.all(
        $viewedDance.dance.instructions.map(async (group) => {
          return await Promise.all(
            group.map(async (callRef) => {
              try {
                const res = await getCallByRef({id: callRef.id});
                return {
                  id: res.call.id,
                  title: res.call.title,
                  skyfeed: res.call.skyfeed,
                  beats: callRef.beats,
                  delay: callRef.delay
                }
              }
              catch {
                return callRef;
              }
            })
          )
        })
      )
      $viewedDance.dance.instructions = [...$viewedDance.dance.instructions];
    },
    async () => {},
    {
      action: "update",
      acting: "updating",
      text: `
        Are you sure you want to update the call references on this dance?
        This will replace every call in your dance with the version in your personal module storage if you have one.
      `,
      item: null,
      confirmColor: "blue",
    }
  );
}

</script>

<div class="sectionLabel">Dance</div>
<div class="DanceOptions">
  {#if $viewedDance.editing}
    <label for="title">Name: </label>
    <input
      id="title"
      type="text"
      bind:value={$viewedDance.dance.title}
    />
    <label for="description">Description: </label>
    <textarea
      id="description"
      bind:value={$viewedDance.dance.text}
    />
    <div>Duration in Beats: {$viewedDance.duration}</div>
    Footwork:
    {#if $viewedDance.dance.footwork}
    <button on:click={() => {selectingFootwork = !selectingFootwork}}>
      {$viewedDance.dance.footwork.title}
    </button>
    {:else if !selectingFootwork}
    <button on:click={() => {selectingFootwork = !selectingFootwork}}>
      Select Footwork (optional)
    </button>
    {/if}
    {#if selectingFootwork}
      <button on:click={() => {
        selectingFootwork = false;
        delete $viewedDance.dance.footwork;
      }}>
        Deselect Footwork
      </button>
      <CallList
        calls={$calls.filter(call => call.isFootwork)}
        on:selectCall={(event) => {
          selectingFootwork = false;
          let newFootwork = event.detail.call
          $viewedDance.dance.footwork = {
            id: newFootwork.id,
            title: newFootwork.title,
            skyfeed: newFootwork.skyfeed,
            beats: $viewedDance.dance.footwork?.beats || newFootwork.beats
          };
        }}
      />
    {/if}
    Hold:
    {#if $viewedDance.dance.hold}
    <button on:click={() => {selectingHold = !selectingHold}}>
      {$viewedDance.dance.hold.title}
    </button>
    {:else if !selectingHold}
    <button on:click={() => {selectingHold = !selectingHold}}>
      Select Hold (optional)
    </button>
    {/if}
    {#if selectingHold}
      <button on:click={() => {
        selectingHold = false;
        delete $viewedDance.dance.hold;
      }}>
        Deselect Hold
      </button>
      <CallList
        calls={$calls.filter(call => call.isHold)}
        on:selectCall={(event) => {
          selectingHold = false;
          let newHold = event.detail.call
          $viewedDance.dance.hold = {
            id: newHold.id,
            title: newHold.title,
            skyfeed: newHold.skyfeed,
            beats: $viewedDance.dance.hold?.beats || newHold.beats
          };
        }}
      />
    {/if}
    Music:
    {#if selectingMusic === false}
      <button on:click={() => {selectingMusic = true}}>Add Music</button>
      {#if $viewedDance.dance.music}
      {#each $viewedDance.dance.music as music, i}
        <div style="display: flex; gap: 1rem;">
          <MusicInfo musicRef={music} />
          <button
            on:click={() => {
              console.log($viewedDance.dance.music.splice(i, 1));
              $viewedDance.dance.music = $viewedDance.dance.music;
            }}
          >
            <Close color="red"/>
          </button>
        </div>
      {/each}
      {/if}
    {:else}
      <button on:click={() => {selectingMusic = false}}>X</button>
      <MusicList
        on:selectMusic={(event) => {addMusic(event.detail.music)}}
        musicList={$musicList}
      />
    {/if}
    {#if $viewedDance.error}
        <p>{$viewedDance.error}</p>
    {/if}
    {#if $viewedDance.saving}
      <button>{$viewedDance.dance.id ? "Saving" : "Creating"} Dance...</button>
    {:else}
      <button on:click={updateDanceCalls} class="UpdateCalls">Update Calls</button>
      <button on:click={() => {dispatch("createDance")}}>{$viewedDance.dance.id ? "Save" : "Create"} Dance</button>
    {/if}
  {:else}
    <h3>Title: {$viewedDance.dance.title}</h3>
    {#if $viewedDance.dance.music}
    {#each $viewedDance.dance.music as music}
      <MusicInfo musicRef={music} />
    {/each}
    {/if}
    {#if $viewedDance.dance.text}
      <div>Description: {$viewedDance.dance.text}</div>
    {/if}
    <div>Duration in Beats: {$viewedDance.duration}</div>
    <Dependencies source={$viewedDance.dance} />
  {/if}
</div>

<style>
  .DanceOptions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 20rem;
    background-color: white;
    border: 2px black solid;
  }
  .sectionLabel {
    padding: 0.5rem 5rem;
    background-color: lightgrey;
    border: 2px solid black;
    font-weight: 500;
  }
  .UpdateCalls {
    margin: 1rem 0rem;
  }
</style>