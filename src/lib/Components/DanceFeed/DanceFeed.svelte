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
}

$: if (!$routeUserId) {
  loadUserData($currentUserId);
} else {
  loadUserData($routeUserId);
}

async function selectDanceBySkyfeed(skyfeed) {
  try {
    const res = await getDanceByRef({skyfeed});
    if (res.dance) {
      dispatch('selectDance', res.dance);
    }
  } catch (err) {
    console.error(err)
  }
}

const routeDanceSkyfeed = getContext("routeDanceSkyfeed");
$: if ($routeDanceSkyfeed) {selectDanceBySkyfeed($routeDanceSkyfeed)};

</script>

<div class="DanceFeed">
  <h1>Dance Feed</h1>
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
</style>