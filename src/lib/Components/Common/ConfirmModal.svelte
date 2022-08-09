<script>
import { createEventDispatcher, getContext } from "svelte";

const modalDetails = getContext('modalDetails');

let text = [];
let item = [];

$: text = $modalDetails.text?.split('\n') || null;
$: item = $modalDetails.item?.split('\n') || null;

const dispatch = createEventDispatcher();

function closeModal() {
    dispatch('closeModal');
}

function confirm() {
    dispatch('confirm');
}

</script>

<div on:click|stopPropagation={() => {$modalDetails.acting ? "" : closeModal()}} class="background"></div>
<div class="modal">
    {#if text}
    {#each text as p}
        <p>{p}</p>
    {/each}
    {:else}
        <p>Are you sure?</p>
    {/if}
    {#if item}
    {#each item as h}
        <h4>{h}</h4>
    {/each}
    {/if}
    <div class="buttons">
        {#if $modalDetails.acting}
        <button class="confirm confirming" style="background-color: {$modalDetails.confirmColor ? $modalDetails.confirmColor : "red"};">{$modalDetails.acting}</button>
        {:else}
        <button on:click|stopPropagation={closeModal}>Cancel</button>
        <button on:click|stopPropagation={confirm} class="confirm" style="background-color: {$modalDetails.confirmColor ? $modalDetails.confirmColor : "red"};">{$modalDetails.action || "Yes"}</button>
        {/if}
    </div>
</div>

<style>
    .background {
        position: fixed;
        z-index: 6;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .modal {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 7;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 2rem;
        max-width: 30%;
        border-radius: 1rem;
        background: #fff;
        filter: drop-shadow(0 0 10px #333);
    }
    .buttons {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .confirm {
        padding: 0.5rem;
        color: white;
        font-weight: 700;
        border: none;
        border-radius: 0.25rem;
    }
    .confirming {
        width: 100%;
    }
</style>