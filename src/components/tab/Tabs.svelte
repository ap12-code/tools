<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        tabs: string[];
        tab: Snippet<[{ name: string }]>;
    }

    let props: Props = $props();
    let selectedTab: string = $state(props.tabs[0]);
</script>

<div class="tabs">
    <div class="nav">
        {#each props.tabs as tab}
            <button class:active={selectedTab == tab} class="nav-button" onclick={() => (selectedTab = tab)}>{tab}</button>
        {/each}
    </div>

    {#if selectedTab}
        <div class="content">
            {@render props.tab?.({ name: selectedTab })}
        </div>
    {/if}
</div>

<style>
    .nav {
        display: flex;
    }
    .nav-button {
        cursor: pointer;
        flex-grow: 1;
        background-color: #222;
        color: #fff;
        border: none;
        border-radius: 3px 3px 0 0;
        padding: 5px 20px;
        box-shadow: 0 0 0 1px #999;
    }
    .active {
        background-color: #181;
        font-weight: bold;
    }
    .content {
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 0 0 1px #999;
    }
</style>
