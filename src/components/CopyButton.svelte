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
    let copied = $state(false);

    async function onClick() {
        await navigator.clipboard.writeText(data);
        copied = true;
        setTimeout(() => [(copied = false)], 1000);
    }
</script>

<Button onclick={onClick}>
    {#if copied}
        <Icon icon="material-symbols:check" class="icon" width="24" height="24" />
    {:else}
        <Icon icon="material-symbols:content-copy-rounded" class="icon" width="24" height="24" />
    {/if}
    {@render children?.()}
</Button>
