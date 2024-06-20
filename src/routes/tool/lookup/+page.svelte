<script lang="ts">
    import Container from "$components/Container.svelte";
    let ip = "";
    let dig_param = "ANY";
    let result = "";
    let error = false;

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

    async function run(t: string) {
        error = false;
        const resp = await fetch(`/tool/lookup/${t}`, {
            body: JSON.stringify({
                address: ip,
                param: dig_param,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (resp.ok) {
            result = await resp.text();
        } else {
            error = true;
        }
    }
</script>

<Container>
    <h1>dig / nslookup</h1>
    <hr />
    <div class="main">
        <div class="input">
            <span>IPアドレス / ドメイン</span>
            <input type="text" placeholder="ap12.net, 1.1.1.1" bind:value={ip} class:err={error} />
        </div>
        <div class="input">
            <p>DIGのパラメータ</p>
            <select bind:value={dig_param}>
                {#each Object.entries(dig_params) as [k, v]}
                    <option value={k}>{v}</option>
                {/each}
            </select>
        </div>
        <div>
            <p>実行</p>
            <button on:click={(_) => run("dig")}>dig実行</button>
            <button on:click={(_) => run("nslookup")}>nslookup実行</button>
        </div>
    </div>
    <hr />
    <p>結果</p>
    <pre>{result}</pre>
</Container>

<style>
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
    pre {
        padding: 5px;
        background-color: #222;
        align-content: center;
        border: #666 solid 1px;
        border-radius: 5px;
        color: #fff;
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
    select {
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        outline: none;
        width: 300px;
    }
</style>
