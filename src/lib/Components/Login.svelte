<script>
  import { useNavigate } from "svelte-navigator";
  import { getContext } from 'svelte'
  import AddToHomescreen from '../../assets/AddToHomescreen.svg';

  const navigate = useNavigate();

  const { skynetState } = getContext('skynetContext')
  let authenticating = false;

  async function logIn() {
    if (!authenticating && $skynetState.mySky) {
      authenticating = true;
      try {
        const success = await skynetState.mySky.requestLoginAccess();

        if (success) {
          const user = await skynetState.mySky.userID();

          $skynetState = { ...skynetState, user };
        }      
      } catch (e) {
        console.log(e);
      }
      authenticating = false
    }
  };

async function logOut() {
    if ($skynetState.mySky) {
      try {
        await skynetState.mySky.logOut();
        $skynetState = { ...skynetState, user: null };
      } catch (e) {
        console.log(e);
      }
    }
};

</script>

<div classname="SkynetButtons">
  {#if authenticating}
    <button classname="login_to_mysky" disabled={true}>
        Waiting for authentication
    </button>
  {:else if $skynetState.user}
    <button
        classname="login_to_mysky"
        on:click={logOut}
    >
        Sign out from MySky
    </button>
  {:else}
    <button classname="login_to_mysky" on:click={logIn}>
        Authenticate with MySky
    </button>
  {/if}

  <a
    target="_blank"
    href="https://homescreen.hns.fileportal.org/#/skylink/GABtl72ZCXQS5akue9LZ7-dHW3ntz_zEJtRjTDrqmvOuNA"
    rel="noreferrer"
  >
    <img src={AddToHomescreen} alt="Add To Skynet Homescreen" classname="homescreen" />
  </a>
</div>

<style>
  .SkynetButtons {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }

  .login_to_mysky {
    margin-bottom: 1rem;
    min-height: 2rem;
    min-width: 20rem;
    background-color: #6ac174;
    border: none;
    border-radius: 0.1rem;
    box-shadow: 1px 1px 4px 2px rgba(1, 1, 1, 0.8);
  }

  .login_to_mysky:active {
    background-color: #5eaa66;
    box-shadow: 0 0 2px 1px rgba(1, 1, 1, 0.8);
  }

  .homescreen {
    width: 20rem;
  }
</style>