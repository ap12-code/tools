<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="buttons">
    {@render children?.()}
</div>

<style>
    .buttons {
        display: flex;
        gap: 5px;
        margin-bottom: 10px;
    }
</style>
