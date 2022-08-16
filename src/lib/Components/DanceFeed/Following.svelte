<script>
import { SocialDAC, ProfileDAC } from 'skynet-dacs-library';

export let userId;
  
const socialDAC = new SocialDAC();
const profileDAC = new ProfileDAC();

let following = [];

async function getFollowing(userId) {
  const res = await socialDAC.getFollowingForUser(userId);
  const filtered = res.filter((element) => {
    return !(element.match(/@/));
  })
  following = await Promise.all(filtered.map(async (element) => {
    let profile = await profileDAC.getProfile(element);
    try {
      profile.avatarUrl = "https://siasky.net/" + profile.avatar[0].url.substring(6);
    } catch {
      profile.avatarUrl = "https://siasky.net/CABdyKgcVLkjdsa0HIjBfNicRv0pqU7YL-tgrfCo23DmWw";
    }
    return profile;
  }));
}

$: getFollowing(userId);
socialDAC.onFollowingChange(() => {
  getFollowing(userId);
})

</script>

<div class="Following">
  <slot />
  {#each following as profile}
    <div class="UserInfo" on:click={() => {window.location.hash = `/user/${profile.userId}`}}>
      <img src={profile.avatarUrl} alt="Profile" class="picture" />
      {profile?.username || ""}
    </div>
  {/each}
</div>

<style>
  .Following {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-height: 50rem;
    border-left: 2px solid;
    border-color: black;
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
</style>