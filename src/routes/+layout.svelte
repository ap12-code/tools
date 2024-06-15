<script lang="ts">
    import { page } from "$app/stores";
    import "bootstrap-icons/font/bootstrap-icons.css"

    const data: Record<string, string> = {
        "/json/manifests": "manifest.json",
        "/json/pack-mcmeta": "pack.mcmeta",
        "/network/ip": "IPチェッカー",
        "/network/lookup": "dig&nslookup",
        "/other/base64": "Base64 エンコーダー&デコーダー",
        "/other/bases": "基数変換",
        "/other/password": "パスワード生成",
        "/other/random": "ランダム整数生成",
        "/other/unicode": "Unicodeエスケープシーケンス",
        "/other/upper-lower": "大文字小文字変換",
        "/other/url": "URLエンコーダー&デコーダー",
        "/other/uuid": "UUID生成",
        "/other/unix-timestamp": "UNIX TIMESTAMP 変換"
    }
</script>

<main>
    <header>
        <div class="logo">
            <img src="/favicon.png" alt="logo" />
            <a href="/" class:back={$page.url.pathname != "/"}>ToolBox</a>
            {#if $page.url.pathname != "/"}
                <a href="/"> / {data[$page.url.pathname]}</a>
            {/if}
        </div>
    </header>

    <div>
        <slot></slot>
    </div>

    <footer>
        <p>©{new Date().getFullYear()} マイクラコマンド研究所 | Created by ap12</p>
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
</style>