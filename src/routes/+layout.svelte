<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import { page } from '$app/stores';
    import './global.css';
    import { onMount } from 'svelte';
    import { tools } from '$lib/tools.json';
    import _ from 'lodash';
    import { dev } from '$app/environment';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    let fs = false;
    let shown_sidebar = $state(false);

    type Tool = { href: string; name: string; icon: string };
    type Tools = Tool[];
    type Category = { icon: string; collapsed: boolean; name: string; tools: Tools }[];
    type CategorySaved = { collapsed: boolean }[];

    let data: Category = $state(tools);
    let favorites: Tools = $state([]);

    let sel = '...';
    function switchSidebar() {
        shown_sidebar = !shown_sidebar;
        save();
    }
    function switchFavorite(tool: Tool) {
        if (favorites.findIndex((p) => p.name == tool.name) != -1) {
            favorites.splice(
                favorites.findIndex((p) => p.name == tool.name),
                1
            );
        } else {
            favorites.push(tool);
        }
        favorites = favorites;
        save();
    }
    function switchCategory(index: number) {
        data[index].collapsed = !data[index].collapsed;
        save();
    }
    function save() {
        window.localStorage.setItem('shown_sidebar', shown_sidebar.toString());
        let parsed: CategorySaved = [];
        for (let i = 0; i < data.length; i++) {
            parsed[i] = { collapsed: data[i].collapsed };
        }
        window.localStorage.setItem('sidebar_data', JSON.stringify(parsed));
        window.localStorage.setItem('sidebar_favorites', JSON.stringify(favorites));
    }
    function load() {
        shown_sidebar = window.localStorage.getItem('shown_sidebar') == 'true';
        const data2 = window.localStorage.getItem('sidebar_data');
        if (data2) {
            const parsed = JSON.parse(data2) as CategorySaved;
            for (let i = 0; i < data.length; i++) {
                data[i].collapsed = parsed[i].collapsed;
            }
        }
        const rawFavorites = window.localStorage.getItem('sidebar_favorites');
        if (rawFavorites) {
            favorites = JSON.parse(rawFavorites) as Tools;
        }
    }
    onMount(load);
    afterNavigate(() => {
        sel = $page.url.pathname;
        load();
    });
</script>

<div class="app">
    {#if shown_sidebar}
        <div class="sidebar scroll">
            <div class="sidebar-inner">
                <div class="button-collapse">
                    <button onclick={switchSidebar}>
                        <i class="bi bi-chevron-left"></i> 非表示
                    </button>
                </div>
                <div class="sidebar-header">
                    <img src="/favicon.png" alt="logo" class="sidebar-logo" />
                    <a href="/" class:back={$page.url.pathname != '/'}>ToolBox</a>
                </div>
                <a class:selected={$page.url.pathname == '/'} class="sidebar-button" href="/">ホーム</a>
                {#each favorites as t}
                    <div class="tool">
                        <a class:selected={$page.url.pathname == t.href} class="sidebar-button" href={t.href}>
                            <span class="icon">{t.icon}</span>
                            {t.name}
                        </a>
                        <button class="favorite-button" onclick={(_) => switchFavorite(t)}>
                            {#if favorites.find((p) => p.name == t.name)}
                                <span class="icon fill">star</span>
                            {:else}
                                <span class="icon">star</span>
                            {/if}
                        </button>
                    </div>
                {/each}
                <hr />
                {#each data as d, i}
                    {#if !d.collapsed}
                        <button onclick={(_) => switchCategory(i)} class="sidebar-button">
                            <span class="icon fill">stat_1</span>
                            {d.name}
                        </button>
                        {#each d.tools as t}
                            <div class="tool mg-right">
                                <a class:selected={$page.url.pathname.startsWith(t.href)} class="sidebar-button" href={t.href}>
                                    <span class="icon fill">{t.icon}</span>
                                    {t.name}
                                </a>
                                <button class="favorite-button" onclick={(_) => switchFavorite(t)}>
                                    {#if favorites.find((p) => p.name == t.name)}
                                        <span class="icon fill">star</span>
                                    {:else}
                                        <span class="icon">star</span>
                                    {/if}
                                </button>
                            </div>
                        {/each}
                    {:else}
                        <button onclick={(_) => switchCategory(i)} class="sidebar-button">
                            <span class="icon fill">stat_minus_1</span>
                            {d.name}
                        </button>
                    {/if}
                {/each}
            </div>
        </div>
    {:else}
        <div class="sidebar-show-button">
            <button onclick={switchSidebar} aria-label="サイドバーを表示">
                <span class="icon">menu</span>
            </button>
        </div>
    {/if}
    <div class="main scroll">
        <div class="dev-banner">
            {#if dev}
                <span>注意: これは開発版サイトです。実際のリリース時のサイトとは異なる場合がございます。</span>
            {/if}
        </div>
        {@render children?.()}

        {#if $page.url.pathname == '/'}
            <div class="footer">
                <span>
                    &copy;2025 ap12<br />
                    このサイトのソースコードはMITでライセンスされています。ソースコード: <a href="https://github.com/ap12-code/tools">GitHub</a>
                </span>
            </div>
        {/if}
    </div>
</div>

<style>
    @keyframes sidebarAnimIn {
        0% {
            transform: translateX(-400px);
        }
        100% {
            transform: translateX(0px);
        }
    }
    @keyframes sidebarAnimOut {
        0% {
            transform: translateX(0px);
        }
        100% {
            transform: translateX(-200px);
        }
    }
    .mg-right {
        margin-left: 20px;
    }
    .button-collapse button {
        cursor: pointer;
        background-color: #222;
        color: #fff;
        border: none;
    }
    .sidebar-show-button {
        position: fixed;
    }
    .sidebar-show-button button {
        cursor: pointer;
        background-color: #222;
        color: #fff;
        border: none;
        margin: 5px;
    }
    .selected {
        background-color: #444;
    }
    .sidebar-header {
        display: flex;
        align-items: center;
    }
    .sidebar-header a {
        text-decoration: none;
        color: #fff;
    }
    .sidebar-logo {
        height: 30px;
        margin: 10px;
        border-radius: 5px;
    }
    hr {
        margin: 5px;
    }
    .sidebar {
        animation: sidebarAnimIn 0.3s ease-in-out;
        background-color: #222;
        min-width: 350px;
        border-right: #000 1px solid;
        position: relative;
        overflow-y: scroll;
    }
    .sidebar-inner {
        position: sticky;
        margin: 5px;
        display: block;
        top: 0px;
    }
    .app {
        display: flex;
        height: 100vh;
    }
    .sidebar-button {
        text-decoration: none;
        color: #fff;
        padding: 5px 10px;
        display: block;
        border-radius: 5px;
    }
    .tool {
        display: flex;
    }
    .tool a {
        flex: 1;
    }
    .tool button {
        cursor: pointer;
        border: none;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        background-color: #222;
    }
    .tool button:hover {
        background-color: #666;
    }
    button.sidebar-button {
        border: none;
        font-size: 16px;
        display: block;
        width: 100%;
        text-align: left;
        background-color: #222;
    }
    .sidebar-button:hover {
        background-color: #666;
    }
    .main {
        flex: 1;
        overflow-y: scroll;
    }

    .back {
        text-decoration: underline;
    }

    @media (max-width: 414px) {
        .sidebar-show-button {
            display: none;
            visibility: hidden;
        }
    }
    .dev-banner {
        background-color: #111;
        display: block;
        text-align: center;
    }

    .footer {
        padding: 5px;
        text-align: center;
        background-color: #111;
    }
    .footer a {
        color: #fff;
    }
</style>
