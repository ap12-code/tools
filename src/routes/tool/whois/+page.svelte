<script lang="ts">
    import Container from "$components/Container.svelte";
    let ip = $state("");
    let result = $state("");
    let error = $state(false);

    async function run() {
        error = false;
        const resp = await fetch(`/tool/whois/whois`, {
            body: JSON.stringify({
                address: ip,
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
    <h1>whois</h1>
    <hr />
    <div class="main">
        <div class="input">
            <span>IPアドレス / ドメイン</span>
            <input type="text" placeholder="ap12.net, 1.1.1.1" bind:value={ip} class:err={error} />
        </div>
        <div>
            <p>実行</p>
            <button onclick={(_) => run()}>whois実行</button>
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
</style>
