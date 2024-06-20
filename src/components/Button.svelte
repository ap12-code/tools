<script lang="ts">
    export let click = () => {};
</script>

<button on:click={click}>
    <slot />
</button>

<style>
    button {
        padding: 5px;
        display: block;
        background-color: #222;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        transition: 0.2s all;
    }
    button:hover {
        background-color: #666;
        transition: 0.2s all;
        cursor: pointer;
    }
</style>
