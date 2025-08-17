<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
        onclick: () => void;
        disabled?: boolean;
    }

    let { children, onclick, disabled }: Props = $props();
</script>

<button {onclick} {disabled} class="button-component">
    {@render children?.()}
</button>

<style>
    button {
        cursor: pointer;
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
    }
    button:disabled {
        background-color: #444;
    }
</style>
