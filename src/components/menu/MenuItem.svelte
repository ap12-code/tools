<script lang="ts">
    import Icon from '@iconify/svelte';
    import { menuContext } from './menu_context.svelte';

    let { id, label, icon, onclick }: { id: string; label: string; icon?: string; onclick: () => any } = $props();

    function on_click() {
        menuContext.activeMenu = '';
        onclick();
    }
</script>

<button class="menu-button" onclick={on_click}>
    {#if icon}
        <Icon icon={`material-symbols:${icon}`} inline width="18px" />
    {:else}
        <div class="dummy-icon"></div>
    {/if}
    <span class="label">{label}</span>
</button>

<style>
    .dummy-icon {
        width: 18px;
    }
    .menu-button {
        cursor: pointer;
        background-color: #222;
        color: #fff;
        border: none;
        transition: 0.1s;
        padding: 5px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .menu-button:hover {
        background-color: #16c;
    }
    .menu-button :global(.icon) {
        display: inline-block;
        font-size: 20px;
        margin-right: 5px;
        vertical-align: middle;
    }
    .menu-button .label {
        vertical-align: middle;
    }
</style>
