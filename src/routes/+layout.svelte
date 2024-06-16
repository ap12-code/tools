<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import "./global.css";

    const data: Record<string, string> = {
        "/": "ホーム",
        "/json/manifests": "manifest.json",
        "/json/pack-mcmeta": "pack.mcmeta",
        "/network/ip": "IPチェッカー",
        "/network/lookup": "dig&nslookup",
        "/network/whois": "whois",
        "/network/ping": "ping",
        "/other/base64": "Base64 エンコーダー&デコーダー",
        "/other/bases": "基数変換",
        "/other/password": "パスワード生成",
        "/other/random": "ランダム整数生成",
        "/other/unicode": "Unicodeエスケープシーケンス",
        "/other/upper-lower": "大文字小文字変換",
        "/other/url": "URLエンコーダー&デコーダー",
        "/other/uuid": "UUID生成",
        "/other/unix-timestamp": "UNIX TIMESTAMP 変換",
        "/other/text-counter": "文字数カウンタ",
        "/other/counter": "カウンタ",
        "/other/clock": "時計",
        "/other/qrcode": "QRコード",
    };

    let sel = "...";
    function move() {
        location.href = sel;
    }
    afterNavigate(() => {
        sel = $page.url.pathname;
    });
</script>

<main>
    <header>
        <div class="logo">
            <img src="/favicon.png" alt="logo" />
            <a href="/" class:back={$page.url.pathname != "/"}>ToolBox</a>
            {#if $page.url.pathname != "/"}
                <i class="bi bi-caret-right-fill"></i>
                <select bind:value={sel} on:change={move}>
                    {#each Object.entries(data) as [k, v]}
                        <option value={k}>{v}</option>
                    {/each}
                </select>
            {/if}
        </div>
    </header>

    <div>
        <slot></slot>
    </div>

    <footer>
        <p>
            ©{new Date().getFullYear()} マイクラコマンド研究所 | Created by ap12
        </p>
    </footer>
</main>

<style>
    footer {
        text-align: center;
        margin-top: auto;
        background-color: #111;
    }
    header a {
        color: #fff;
        text-decoration: none;
    }
    header {
        border-bottom: 1px solid #000;
        padding: 5px 20px;
    }
    main {
        display: flex;
        height: 100vh;
        flex-direction: column;
    }
    .logo {
        height: 30px;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
    }
    .logo > img {
        height: 30px;
        width: 30px;
        border-radius: 5px;
        border: #fff 1px solid;
    }
    .back {
        text-decoration: underline;
    }
    select {
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        outline: none;
        width: 300px;
    }
</style>
