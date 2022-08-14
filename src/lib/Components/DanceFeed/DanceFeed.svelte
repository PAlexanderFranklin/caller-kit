<script>
import { createEventDispatcher, getContext } from 'svelte';
import { FeedDAC, ProfileDAC } from 'skynet-dacs-library';
import { getDanceByRef } from '/src/lib/utils/danceModule';
import Post from './Post.svelte';

const currentUserId = getContext("currentUserId");
const routeUserId = getContext("routeUserId");

const feedDAC = new FeedDAC();
const profileDAC = new ProfileDAC();

let profile;
let avatarUrl = "https://siasky.net/LACvgAooUazOoS0v1xYEo5MEDn6zBSmTgwDWJG2ji955YQ";
let posts = [];
let filteredPosts = [];
let filterText = "";

const dispatch = createEventDispatcher();

$: filterText, filteredPosts = posts.filter((post) => {
  let filter = new RegExp(filterText.toLowerCase());
  return Boolean(filterText === ""
    || post.content?.title?.toLowerCase().match(filter)
    || post.content?.text?.toLowerCase().match(filter)
  )
})

async function loadUserData(userId) {
  posts = await feedDAC.loadPostsForUser(userId, 'dances');
  profile = await profileDAC.getProfile(userId);
  if (profile.avatar) {
    avatarUrl = "https://siasky.net/" + profile.avatar[0].url.substring(6);
  } else {
    avatarUrl = "https://siasky.net/LACvgAooUazOoS0v1xYEo5MEDn6zBSmTgwDWJG2ji955YQ";
  }
  feedDAC.listenForPosts(userId, "dances", function (post) {
    posts.unshift(post);
    posts = posts;
  })
}

$: if (!$routeUserId) {
  loadUserData($currentUserId);
} else {
  loadUserData($routeUserId);
}

function navigateToProfile(userId) {
  window.location.hash = `/user/${userId}`;
}

async function selectDanceBySkyfeed(skyfeed) {
  try {
    const res = await getDanceByRef({skyfeed});
    if (res.dance) {
      dispatch('selectDance', {dance: res.dance});
    }
  } catch (err) {
    console.error(err)
  }
}

const routeDanceSkyfeed = getContext("routeDanceSkyfeed");
$: if ($routeDanceSkyfeed) {selectDanceBySkyfeed($routeDanceSkyfeed)};

</script>

<div class="DanceFeed">
  <button on:click={() => {navigateToProfile($currentUserId)}}>Go to my feed</button>
  <div>
    <h1>Dance Feed</h1>
    <h4 class="UserInfo"><img src={avatarUrl} alt="Profile" class="picture" /> {profile?.username || ""}</h4>
  </div>
  <div>
    Search: <input type="text" bind:value={filterText} />
  </div>
  {#each filteredPosts as post (post.id)}
      <Post
        post={post}
        on:selectDance
      />
  {/each}
</div>

<style>
  .DanceFeed {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 3rem;
    max-height: 50rem;
    overflow-y: scroll;
    width: 80%;
    background-color: white;
    border: 2px solid;
    border-color: black;
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
</style>