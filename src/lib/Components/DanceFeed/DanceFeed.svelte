<script>
import { IdentityDAC, FeedDAC } from 'skynet-dacs-library';
import { createEventDispatcher } from 'svelte';
import Post from './Post.svelte';

export let userId = null;

const identityDAC = new IdentityDAC();
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
  identityDAC.userID().then((id) => {userId = id});
} else {
  feedDAC.loadPostsForUser(userId, 'dances').then((res) => {posts = res});
}

</script>

<div class="DanceFeed">
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