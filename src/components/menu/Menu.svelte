<script lang="ts">
    import { onMount, type Snippet } from 'svelte';
    import { menuContext } from './menu_context.svelte';

    let { children, label, id, disabled }: { id: string; label: string; children: Snippet; disabled?: boolean } = $props();

    function nav_click(name: string) {
        if (disabled) return;
        if (menuContext.activeMenu != '' && name == menuContext.activeMenu) {
            menuContext.activeMenu = '';
            return;
        }
        menuContext.activeMenu = name;
    }

    onMount(() => {
        document.body.addEventListener('click', (event) => {
            if (event.target instanceof HTMLButtonElement) return;
            menuContext.closeMenu();
        });
    });
</script>

<div data-nav="nav" class="menu">
    <button onclick={() => nav_click(id)} {disabled} class:active={menuContext.activeMenu == id}>{label}</button>
    <div class="nav-ctx" class:show={menuContext.activeMenu == id}>
        {@render children()}
    </div>
</div>

<style>
    button {
        background-color: #222;
        color: #fff;
        border: none;
        border-radius: 3px;
        padding: 0 10px;
        line-height: 20px;
        width: 100%;
        transition: 0.1s;
    }
    button:not(:disabled):hover,
    button.active {
        background-color: #444;
    }
    .nav-ctx:not(.show) {
        display: none;
    }
    .nav-ctx {
        position: absolute;
        background-color: #222;
        width: 200px;
        display: flex;
        padding: 3px;
        flex-direction: column;
        border-radius: 3px;
        border: 1px solid #666;
    }
    .nav-ctx :global(button) {
        text-align: left;
        font-size: 14px;
    }
</style>
