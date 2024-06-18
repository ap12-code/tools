<script lang="ts">
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import "./global.css";

    let fs = false;

    const data: Record<string, string> = {
        "/": "ホーム",
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
    afterNavigate(() => {
        sel = $page.url.pathname;
    });
</script>

<main>
    <header class:pin={fs}>
        <div class="logo">
            <img src="/favicon.png" alt="logo" />
            <a href="/" class:back={$page.url.pathname != "/"}>ToolBox</a>
            {#if $page.url.pathname != "/"}
                <i class="bi bi-caret-right-fill"></i>
                <select bind:value={sel} on:change={move} class="no-font">
                    {#each Object.entries(data) as [k, v]}
                        <option value={k}>{v}</option>
                    {/each}
                </select>
            {/if}
            <div class="fs">
                <button on:click={(_) => (fs = !fs)}><i class="bi bi-fullscreen"></i></button>
            </div>
        </div>
    </header>

    <div>
        <slot></slot>
    </div>

    <footer class:pin={fs}>
        <p>
            ©{new Date().getFullYear()} ap12
        </p>
    </footer>
</main>

<style>
    .fs {
        margin-left: auto;
    }
    .fs > button {
        border: none;
        background-color: #222;
        color: #fff;
        cursor: pointer;
        font-size: 20px;
    }
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
    .pin {
        opacity: 0;
        transition: 0.3s all;
    }
    .pin:hover {
        opacity: 1;
        transition: 0.3s all;
    }
</style>
