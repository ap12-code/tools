<script lang="ts">
    import type { Snippet } from 'svelte';
    import Button from './Button.svelte';
    import Icon from '@iconify/svelte';

    interface Props {
        children: Snippet;
        disabled?: boolean;
        data: string;
    }

    let { children, disabled, data }: Props = $props();
    let copied = false;
    async function onClick() {
        await navigator.clipboard.writeText(data);
    }
</script>

<Button onclick={onClick}>
    {#if copied}
        <Icon icon="material-symbols:check" width="24" height="24" />
    {:else}
        <Icon icon="material-symbols:content-copy-rounded" class="icon" />
    {/if}
    {@render children?.()}
</Button>
