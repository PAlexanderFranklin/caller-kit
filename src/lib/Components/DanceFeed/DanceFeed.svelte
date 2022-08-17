<script>
import { createEventDispatcher, getContext } from 'svelte';
import { FeedDAC, SocialDAC, ProfileDAC } from 'skynet-dacs-library';
import { getDanceByRef } from '/src/lib/utils/danceModule';
import Post from './Post.svelte';
import Following from './Following.svelte';

const currentUserId = getContext("currentUserId");
const routeUserId = getContext("routeUserId");

const feedDAC = new FeedDAC();
const socialDAC = new SocialDAC();
const profileDAC = new ProfileDAC();

let profile;
let avatarUrl = "https://siasky.net/CABdyKgcVLkjdsa0HIjBfNicRv0pqU7YL-tgrfCo23DmWw";
let following = false;
let followAction = false;
let posts = [];
let filteredPosts = [];
let filterText = "";

const dispatch = createEventDispatcher();

$: filterText, filteredPosts = posts.filter((post) => {
  let filter = new RegExp(filterText.toLowerCase());
  return Boolean(filterText === ""
    || post.content?.title?.toLowerCase().match(filter)
  )
})

async function loadUserData(userId) {
  posts = await feedDAC.loadPostsForUser(userId, 'dances');
  profile = await profileDAC.getProfile(userId);
  following = await socialDAC.isFollowing(userId);
  try {
    avatarUrl = "https://siasky.net/" + profile.avatar[0].url.substring(6);
  } catch {
    avatarUrl = "https://siasky.net/CABdyKgcVLkjdsa0HIjBfNicRv0pqU7YL-tgrfCo23DmWw";
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

const routeDanceSkyfeed = getContext("routeDanceSkyfeed");
$: if ($routeDanceSkyfeed) {selectDanceBySkyfeed($routeDanceSkyfeed)};

</script>

<div class="FeedPage">
  <div class="DanceFeed">
    <button on:click={() => {navigateToProfile($currentUserId)}}>Go to my feed</button>
    <div>
      <h1>Dance Feed</h1>
      <h4 class="UserInfo">
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
  <Following userId={$routeUserId}>This user is following:</Following>
  <Following userId={$currentUserId}>You are following:</Following>
</div>

<style>
  .FeedPage {
    display: flex;
    min-height: 30rem;
    max-height: 30rem;
    width: 80%;
    background-color: white;
    border: 2px solid;
    border-color: black;
  }
  .DanceFeed {
    display: flex;
    flex-direction: column;
    width: 80%;
    gap: 0.75rem;
    padding: 3rem;
    overflow-y: scroll;
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
</style>