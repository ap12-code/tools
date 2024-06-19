<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import "./global.css";
    import { onMount } from "svelte";
    import _ from "lodash";

    let fs = false;
    let shown_sidebar = false;

    type Tool = { href: string; name: string; icon: string };
    type Tools = Tool[];
    type Category = { icon: string; collapsed: boolean; name: string; tools: Tools }[];
    type CategorySaved = { collapsed: boolean }[];

    let data: Category = [
        {
            name: "変換ツール",
            icon: "",
            tools: [
                {
                    href: "/tool/bases",
                    name: "基数",
                    icon: "nut-fill",
                },
                {
                    href: "/tool/upper-lower",
                    name: "大文字小文字",
                    icon: "type",
                },
                {
                    href: "/tool/unix-timestamp",
                    name: "UNIX TIMESTAMP",
                    icon: "clock-fill",
                },
                {
                    href: "/tool/image",
                    name: "画像変換ツール",
                    icon: "image-fill",
                },
            ],
            collapsed: false,
        },
        {
            name: "生成ツール",
            icon: "",
            tools: [
                {
                    href: "/tool/uuid",
                    name: "UUID",
                    icon: "info-lg",
                },
                {
                    href: "/tool/password",
                    name: "パスワード",
                    icon: "asterisk",
                },
                {
                    href: "/tool/random",
                    name: "ランダム整数",
                    icon: "123",
                },
                {
                    href: "/tool/qrcode",
                    name: "QRコード",
                    icon: "qr-code",
                },
                {
                    href: "/tool/pack-mcmeta",
                    name: "pack.mcmeta",
                    icon: "boxes",
                },
                {
                    href: "/tool/manifest-json",
                    name: "manifest.json",
                    icon: "filetype-json",
                },
            ],
            collapsed: false,
        },
        {
            name: "エンコーダー/デコーダー",
            icon: "",
            tools: [
                {
                    href: "/tool/base64",
                    name: "base64",
                    icon: "file-text",
                },
                {
                    href: "/tool/url",
                    name: "URL",
                    icon: "slash-lg",
                },
                {
                    href: "/tool/unicode",
                    name: "UNICODEエスケープシーケンス",
                    icon: "card-text",
                },
                {
                    href: "/tool/html",
                    name: "HTML",
                    icon: "code",
                },
            ],
            collapsed: false,
        },
        {
            name: "ネットワーク",
            icon: "",
            tools: [
                {
                    href: "/tool/ip",
                    name: "IPチェッカー",
                    icon: "globe2",
                },
                {
                    href: "/tool/lookup",
                    name: "dig&nslookup",
                    icon: "wrench",
                },
                {
                    href: "/tool/whois",
                    name: "whois",
                    icon: "bricks",
                },
                {
                    href: "/tool/ping",
                    name: "ping",
                    icon: "activity",
                },
                {
                    href: "/tool/mcsrvstat",
                    name: "MCサーバーステータス",
                    icon: "box-fill",
                },
            ],
            collapsed: false,
        },
        {
            name: "カウンタ",
            icon: "",
            tools: [
                {
                    href: "/tool/counter",
                    name: "カウンタ",
                    icon: "file-text-fill",
                },
                {
                    href: "/tool/text-counter",
                    name: "文字数カウンタ",
                    icon: "file-text-fill",
                },
            ],
            collapsed: false,
        },
        {
            name: "時間",
            icon: "",
            tools: [
                {
                    href: "/tool/clock",
                    name: "時計",
                    icon: "clock",
                },
                {
                    href: "/tool/stopwatch",
                    name: "ストップウォッチ",
                    icon: "stopwatch",
                },
            ],
            collapsed: false,
        },
    ];
    let favorites: Tools = [];

    let sel = "...";
    function move() {
        location.href = sel;
    }
    function switchSidebar() {
        shown_sidebar = !shown_sidebar;
        save();
    }
    function switchFavorite(tool: Tool) {
        if (favorites.findIndex((p) => p.name == tool.name) != -1) {
            favorites.splice(
                favorites.findIndex((p) => p.name == tool.name),
                1,
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
        window.localStorage.setItem("shown_sidebar", shown_sidebar.toString());
        let parsed: CategorySaved = [];
        for (let i = 0; i < data.length; i++) {
            parsed[i] = { collapsed: data[i].collapsed };
        }
        window.localStorage.setItem("sidebar_data", JSON.stringify(parsed));
        window.localStorage.setItem("sidebar_favorites", JSON.stringify(favorites));
    }
    function load() {
        shown_sidebar = window.localStorage.getItem("shown_sidebar") == "true";
        const data2 = window.localStorage.getItem("sidebar_data");
        if (data2) {
            const parsed = JSON.parse(data2) as CategorySaved;
            for (let i = 0; i < data.length; i++) {
                data[i].collapsed = parsed[i].collapsed;
            }
        }
        const rawFavorites = window.localStorage.getItem("sidebar_favorites");
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

<main>
    <div class="app">
        {#if shown_sidebar}
            <div class="sidebar">
                <div class="sidebar-inner">
                    <div class="button-collapse">
                        <button on:click={switchSidebar}>
                            <i class="bi bi-chevron-left"></i> 非表示
                        </button>
                    </div>
                    <div class="sidebar-header">
                        <img src="/favicon.png" alt="logo" class="sidebar-logo" />
                        <a href="/" class:back={$page.url.pathname != "/"}>ToolBox</a>
                    </div>
                    <a class:selected={$page.url.pathname == "/"} class="sidebar-button" href="/">ホーム</a>
                    {#each favorites as t}
                        <div class="tool">
                            <a class:selected={$page.url.pathname == t.href} class="sidebar-button" href={t.href}>
                                <i class="bi bi-{t.icon}"></i>
                                {t.name}
                            </a>
                            <button class="favorite-button" on:click={(_) => switchFavorite(t)}>
                                {#if favorites.find((p) => p.name == t.name)}
                                    <i class="bi bi-star-fill"></i>
                                {:else}
                                    <i class="bi bi-star"></i>
                                {/if}
                            </button>
                        </div>
                    {/each}
                    <hr />
                    {#each data as d, i}
                        {#if !d.collapsed}
                            <button on:click={(_) => switchCategory(i)} class="sidebar-button">
                                <i class="bi bi-caret-up-fill"></i>
                                {d.name}
                            </button>
                            {#each d.tools as t}
                                <div class="tool mg-right">
                                    <a class:selected={$page.url.pathname == t.href} class="sidebar-button" href={t.href}>
                                        <i class="bi bi-{t.icon}"></i>
                                        {t.name}
                                    </a>
                                    <button class="favorite-button" on:click={(_) => switchFavorite(t)}>
                                        {#if favorites.find((p) => p.name == t.name)}
                                            <i class="bi bi-star-fill"></i>
                                        {:else}
                                            <i class="bi bi-star"></i>
                                        {/if}
                                    </button>
                                </div>
                            {/each}
                        {:else}
                            <button on:click={(_) => switchCategory(i)} class="sidebar-button">
                                <i class="bi bi-caret-down-fill"></i>
                                {d.name}
                            </button>
                        {/if}
                    {/each}
                </div>
            </div>
        {:else}
            <div class="sidebar-show-button">
                <button on:click={switchSidebar}>
                    <i class="bi bi-list"></i>
                </button>
            </div>
        {/if}
        <div class="main">
            <slot></slot>
        </div>
    </div>

    <footer class:pin={fs}>
        <span class="copyright">©{new Date().getFullYear()} ap12</span><br />
        <a href="https://github.com/ap12-code" target="_blank">GitHub</a> | <a href="https://twitter.ap12.net" target="_blank">Twitter</a>
    </footer>
</main>

<style>
    @keyframes sidebarAnimIn {
        0% {
            transform: translateX(-200px);
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
    .copyright {
        font-size: 18px;
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
        min-width: 300px;
        border-right: #000 1px solid;
        position: relative;
    }
    .sidebar-inner {
        position: sticky;
        margin: 5px;
        display: block;
        top: 0px;
    }
    .app {
        display: flex;
    }
    .sidebar-button {
        text-decoration: none;
        color: #fff;
        padding: 5px 10px;
        display: block;
        border-radius: 5px;
    }
    .tool.sidebar-button {
        margin-left: 15px;
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
    }
    footer {
        text-align: center;
        margin-top: auto;
        background-color: #111;
    }
    footer a {
        color: #fff;
    }
    main {
        display: flex;
        height: 100vh;
        flex-direction: column;
    }

    .back {
        text-decoration: underline;
    }
    .pin {
        opacity: 0;
        transition: 0.3s all;
    }
    .pin:hover {
        opacity: 1;
        transition: 0.3s all;
    }
</style>
