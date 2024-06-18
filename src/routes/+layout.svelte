<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import "./global.css";
    import { onMount } from "svelte";

    let fs = false;
    let shown_sidebar = false;

    const data: Record<string, string> = {
        "/tool/manifests": "manifest.json",
        "/tool/pack-mcmeta": "pack.mcmeta",
        "/tool/ip": "IPチェッカー",
        "/tool/lookup": "dig&nslookup",
        "/tool/whois": "whois",
        "/tool/ping": "ping",
        "/tool/base64": "Base64 エンコーダー&デコーダー",
        "/tool/bases": "基数変換",
        "/tool/password": "パスワード生成",
        "/tool/random": "ランダム整数生成",
        "/tool/unicode": "Unicodeエスケープシーケンス",
        "/tool/upper-lower": "大文字小文字変換",
        "/tool/url": "URLエンコーダー&デコーダー",
        "/tool/uuid": "UUID生成",
        "/tool/unix-timestamp": "UNIX TIMESTAMP 変換",
        "/tool/text-counter": "文字数カウンタ",
        "/tool/counter": "カウンタ",
        "/tool/clock": "時計",
        "/tool/qrcode": "QRコード",
        "/tool/mcsrvstat": "MCサーバーステータス",
        "/tool/html": "HTMLエンコーダー&デコーダー",
        "/tool/stopwatch": "ストップウォッチ",
        "/tool/image": "画像形式変換",
    };

    let sel = "...";
    function move() {
        location.href = sel;
    }
    function switchSidebar() {
        shown_sidebar = !shown_sidebar;
        save();
    }
    function save() {
        window.localStorage.setItem("shown_sidebar", shown_sidebar.toString());
    }
    function load() {
        shown_sidebar = window.localStorage.getItem("shown_sidebar") == "true";
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
                    <hr />
                    {#each Object.keys(data).toSorted((a, b) => a.charCodeAt(6) - b.charCodeAt(6)) as d}
                        <a class:selected={$page.url.pathname == d} class="sidebar-button" href={d}>{data[d]}</a>
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
        background-color: #666;
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
