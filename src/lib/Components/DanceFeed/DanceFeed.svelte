<script>
import { createEventDispatcher, getContext } from 'svelte';
import { FeedDAC } from 'skynet-dacs-library';
import Post from './Post.svelte';

export let userId = null;
const currentUserId = getContext('currentUserId');

const feedDAC = new FeedDAC();

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

$: if (!userId) {
  feedDAC.loadPostsForUser($currentUserId, 'dances').then((res) => {posts = res});
} else {
  feedDAC.loadPostsForUser(userId, 'dances').then((res) => {posts = res});
}

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