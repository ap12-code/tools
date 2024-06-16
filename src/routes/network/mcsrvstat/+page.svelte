<script lang="ts">
    import Container from "$components/Container.svelte";
    let ip = "";
    let dig_param = "ANY";
    let result: Record<string, any> = {
        players: {},
    };
    let error = false;
    let processing = false;
    let has_result = false;

    const dig_params = {
        A: "Aレコード - ホストアドレス",
        ANY: "ANY - 全て",
        CNAME: "CNAMEレコード - CNAMEレコード情報",
        MX: "MXレコード - メールサーバー",
        NS: "NSレコード - DNSサーバー",
        SOA: "SOAレコード - 管理情報",
        HINFO: "HINFO - ホスト情報",
        AXFR: "AXFR - ゾーン転送情報",
        TXT: "TXTレコード - TXTレコード情報",
    };

    async function run() {
        processing = true;
        has_result = false;
        error = false;
        const resp = await fetch(`/network/mcsrvstat/lookup`, {
            body: JSON.stringify({
                address: ip,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (resp.ok) {
            result = await resp.json();
            result.description = parseText(result.description);
            has_result = true;
        } else {
            error = true;
        }
        processing = false;
    }

    const COLOR_MAPPING: Record<string, string> = {
        0: "color: #000",
        1: "color: #00a",
        2: "color: #0a0",
        3: "color: #0aa",
        4: "color: #a00",
        5: "color: #a0a",
        6: "color: #fa0",
        7: "color: #aaa",
        8: "color: #555",
        9: "color: #55f",
        a: "color: #5f5",
        b: "color: #5ff",
        c: "color: #f55",
        d: "color: #f5f",
        e: "color: #ff5",
        f: "color: #fff",
    };

    function parseText(text: string): string {
        if (!text) return "";
        let a = "";
        for (let str of text.split("§")) {
            if (!str) continue;
            a += str.replace(
                str,
                `<span style="${COLOR_MAPPING[str.at(0) || "f"] || ""};">${str.substring(1)}</span>`,
            );
        }
        a = a.replaceAll("\n", "<br />");
        return a;
    }
</script>

<Container>
    <h1>MCサーバーステータス</h1>
    <hr />
    <div class="main">
        <div class="input">
            <span>IPアドレス / ドメイン</span>
            <input
                type="text"
                placeholder="komaken.net, 1.1.1.1"
                bind:value={ip}
                class:err={error}
            />
        </div>
        <div>
            <button on:click={(_) => run()}>実行</button>
        </div>
    </div>
    <hr />
    {#if processing}
        <p>検索中...</p>
    {/if}
    {#if has_result}
        <p>結果</p>
        <div class="result">
            <img src={result.favicon} alt="NoLogo" class="logo" />
            <p class="description">{@html result.description}</p>
            <div class="playercount">
                <p>{result.players.online}/{result.players.max}</p>
            </div>
        </div>
    {/if}
</Container>

<style>
    .logo {
        width: 80px;
        height: 80px;
    }
    .playercount {
        margin-left: auto;
    }
    .result {
        display: flex;
        gap: 10px;
    }
    .err {
        border-color: #d00;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    input {
        background-color: #222;
        padding: 5px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 24px;
        width: 100%;
    }
    button {
        padding: 5px 10px;
        background-color: #222;

        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        transition: 0.2s all;
    }
    button:hover {
        background-color: #666;
        transition: 0.2s all;
        cursor: pointer;
    }
</style>
