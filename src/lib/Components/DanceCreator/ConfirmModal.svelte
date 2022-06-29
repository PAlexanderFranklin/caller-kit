<script>
import { createEventDispatcher, getContext } from "svelte";

const modalDetails = getContext('modalDetails');

const dispatch = createEventDispatcher();

function closeModal() {
    dispatch('closeModal');
}

function confirm() {
    dispatch('confirm');
}

</script>

<div on:click|stopPropagation={closeModal} class="background"></div>
<div class="modal">
    <p>Are you sure you want to {$modalDetails.action || "delete"} this {$modalDetails.noun || "item"}?</p>
    <h3>{$modalDetails.item || ""}</h3>
    <div class="buttons">
        <button on:click|stopPropagation={closeModal}>Cancel</button>
        <button on:click|stopPropagation={confirm} class="confirm" style="background-color: {$modalDetails.confirmColor ? $modalDetails.confirmColor : "red"};">{$modalDetails.action || "Yes"}</button>
    </div>
</div>

<style>
    .background {
        position: fixed;
        z-index: 1;
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
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 2rem;
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
</style>