<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        text?: string;
        children: Snippet;
    }

    let { children, text }: Props = $props();
</script>

<div class="tooltip">
    {#if text}
        <p class="tooltip-text">{text}</p>
    {/if}
    {@render children?.()}
</div>

<style>
    .tooltip {
        position: relative;
    }
    .tooltip-text {
        opacity: 0;
        position: absolute;
        background-color: #111;
        padding: 5px 10px;
        line-height: 1.3;
        bottom: 5px;
        display: inline-block;
        border-radius: 3px;
        transition: all 0.2s ease-in;
        font-size: 0.8rem;
    }
    .tooltip:hover .tooltip-text {
        opacity: 1;
    }
</style>
