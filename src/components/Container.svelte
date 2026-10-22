<script lang="ts">
    import { page } from '$app/state';
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';

    interface Props {
        show_back?: boolean;
        back_to?: string;
        children?: import('svelte').Snippet;
        full?: boolean;
    }

    let { show_back = true, back_to, children, full = false }: Props = $props();

    onMount(() => {
        if (page.url.searchParams.has('ref') && !back_to) {
            back_to = page.url.searchParams.get('ref')!!;
        } else {
            back_to = '/';
        }
    });
</script>

<div class="container" class:full>
    {#if show_back}
        <a class="back" href={back_to}>
            <Icon icon="material-symbols:arrow-left" class="icon" />{back_to == '/' ? 'ホームに戻る' : '戻る'}
        </a>
    {/if}
    {@render children?.()}
</div>

<style>
    .back {
        color: #fff;
        text-decoration: none;
    }
    @media (max-width: 1025px) {
        .container {
            margin: 10px 15px;
        }
    }
    @media (max-width: 720px) {
        .container {
            margin: 10px 5px;
        }
    }
    @media (min-width: 1025px) {
        .container {
            margin: 20px 100px;
        }
    }
    .full {
        margin: 10px;
    }
</style>
