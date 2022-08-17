<script>
import { createEventDispatcher, getContext } from "svelte";
import { SocialDAC, ProfileDAC } from 'skynet-dacs-library';
import { calls, getCallByRef, dances, getDanceByRef, musicList } from '/src/lib/utils/danceModule';
import CallList from "/src/lib/Components/Common/CallList/CallList.svelte";
import Close from "svelte-material-icons/Close.svelte";
import Dependencies from "/src/lib/Components/Common/Calls/Dependencies.svelte";
import MusicList from "/src/lib/Components/Common/MusicList/MusicList.svelte";
import MusicInfo from "/src/lib/Components/Common/Music/MusicInfo.svelte";
import Download from "svelte-material-icons/Download.svelte";
import ClipboardOutline from "svelte-material-icons/ClipboardOutline.svelte";

const dispatch = createEventDispatcher();
const socialDAC = new SocialDAC();
const profileDAC = new ProfileDAC();

const viewedDance = getContext("viewedDance");
const openModal = getContext("openModal");

let selectingFootwork = false;
let selectingHold = false;
let selectingMusic = false;

let profile;
let avatarUrl = "https://siasky.net/CABdyKgcVLkjdsa0HIjBfNicRv0pqU7YL-tgrfCo23DmWw";
let following = false;
let followAction = false;

async function followUser(userId) {
  followAction = true;
  socialDAC.follow(userId).then(() => {
    following = true;
  }).finally(() => {
    followAction = false;
  })
}

async function unfollowUser(userId) {
  followAction = true;
  socialDAC.unfollow(userId).then(() => {
    following = false;
  }).finally(() => {
    followAction = false;
  })
}

async function loadUserData(userId) {
  profile = await profileDAC.getProfile(userId);
  try {
    avatarUrl = "https://siasky.net/" + profile.avatar[0].url.substring(6);
  } catch {
    avatarUrl = "https://siasky.net/CABdyKgcVLkjdsa0HIjBfNicRv0pqU7YL-tgrfCo23DmWw";
  }
}

$: if ($viewedDance.dance.skyfeed) {
  const [a, b, userId, ...address] = $viewedDance.dance.skyfeed.split('/');
  loadUserData(userId);
}

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
      let footworkPromise = null;
      if ($viewedDance.dance.footwork) {
        footworkPromise = getCallByRef({id: $viewedDance.dance.footwork.id});
      }
      let holdPromise = null;
      if ($viewedDance.dance.hold) {
        holdPromise = getCallByRef({id: $viewedDance.dance.hold.id});
      }
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
      const footworkResponse = await footworkPromise;
      if (footworkResponse) {
        $viewedDance.dance.footwork = {
          id: footworkResponse.call.id,
          title: footworkResponse.call.title,
          skyfeed: footworkResponse.call.skyfeed,
          beats: $viewedDance.dance.footwork.beats,
          delay: $viewedDance.dance.footwork.delay
        }
      }
      const holdResponse = await holdPromise;
      if (holdResponse) {
        $viewedDance.dance.hold = {
          id: holdResponse.call.id,
          title: holdResponse.call.title,
          skyfeed: holdResponse.call.skyfeed,
          beats: $viewedDance.dance.hold.beats,
          delay: $viewedDance.dance.hold.delay
        }
      }
      $viewedDance.dance.instructions = [...$viewedDance.dance.instructions];
    },
    async () => {},
    {
      action: "update",
      acting: "updating",
      text: `
        Are you sure you want to update the call references on this dance?
        This will replace every call in your dance with the version in your personal module storage if you have one. ${$viewedDance.dance.footwork || $viewedDance.dance.hold ? `This includes the ${$viewedDance.dance.footwork ? "footwork " : ""}${$viewedDance.dance.footwork && $viewedDance.dance.hold ? "and " : ""}${$viewedDance.dance.hold ? "hold " : ""}calls.` : ""}
        You will still need to save the dance for the changes to take effect.
      `,
      item: null,
      confirmColor: "blue",
    }
  );
}

async function copyDanceLink() {
  await navigator.clipboard.writeText(`callerkit.hns.skynetfree.net/#/dance/${$viewedDance.dance.skyfeed.split("//")[1]}`);
}

async function handleSaveDance() {
  let userDance;
  try {
    const res = await getDanceByRef({id: $viewedDance.dance.id});
    userDance = res.dance;
  } catch (error) {
    userDance = null;
  }
  if (userDance) {
    openModal(
      async () => {
        const res = await updateDance($viewedDance.dance);
        $dances = res.dances;
        return res;
      },
      async () => {},
      {
        action: "overwrite",
        acting: "overwriting",
        text: "A dance with the same id was found in your personal storage! \n If you save this dance, it will overwrite the version in your personal storage, are you sure you want to do that?",
        item: `Title: New: ${$viewedDance.dance.title}, Old: ${userDance.title} \n Id: ${userDance.id}`,
        confirmColor: "red",
      }
    );
  }
  else {
    openModal(
      async () => {
        const res = await insertDance($viewedDance.dance);
        $dances = res.dances;
        return res;
      },
      async () => {},
      {
        action: "save",
        acting: "saving",
        text: "Are you sure you want to save this dance to your personal module storage? None of its dependencies will be saved, you will have to save them separately if you want to avoid losing them.",
        item: $viewedDance.dance.title,
        confirmColor: "blue",
      }
    );
  }
}

</script>

<div class="sectionLabel">Dance</div>
<div class="DanceOptions">
  {#if $viewedDance.editing}
    <label for="title">Title: </label>
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
    <div class="SaveButtons">
      {#if $viewedDance.saving}
        <button>{$viewedDance.dance.id ? "Saving" : "Creating"} Dance...</button>
      {:else}
        <button on:click={updateDanceCalls}>Update Calls</button>
        <button on:click={() => {dispatch("createDance")}}>{$viewedDance.dance.id ? "Save" : "Create"} Dance</button>
      {/if}
    </div>
  {:else}
    <div class="TitleSection">
      <h3>Title: {$viewedDance.dance.title}</h3>
      {#if $viewedDance.dance.skyfeed}
        <button on:click={handleSaveDance} style="height: 2rem;"><Download color={"blue"} /></button>
        <button on:click={copyDanceLink} style="height: 2rem;"><ClipboardOutline color={"blue"} /></button>
      {/if}
    </div>
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
    {#if $viewedDance.dance.skyfeed}
      <h4 class="UserInfo">
        By:
        <img src={avatarUrl} alt="Profile" class="picture" />
        {profile?.username || ""}
        {#if following}
          <button on:click={() => {unfollowUser(profile.userId)}} class="unfollow">
            {followAction ? "Un" : ""}Following
          </button>
        {:else}
          <button on:click={() => {followUser(profile.userId)}} class="follow">
            Follow{followAction ? "ing..." : ""}
          </button>
        {/if}
      </h4>
    {/if}
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
  .SaveButtons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
  .UserInfo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .picture {
    width: 2rem;
    border-radius: 0.5rem;
  }
  .follow:hover {
    color: white;
    background-color: blue;
    border: blue solid 2px;
  }
  .unfollow:hover {
    color: white;
    background-color: red;
    border: red solid 2px;
  }
  .TitleSection {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  #description {
    height: 5rem;
  }
</style>