<script lang="ts">
    import Container from "$components/Container.svelte";
    let mcid = "";
    let result: Record<string, any> = {
        players: {},
    };
    let error = false;
    let processing = false;
    let has_result = false;

    async function run() {
        processing = true;
        has_result = false;
        error = false;
        const resp = await fetch(`/tool/mcid/lookup`, {
            method: "POST",
            body: JSON.stringify({
                mcid: mcid,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (resp.ok) {
            result = await resp.json();
            has_result = true;
        } else {
            error = true;
        }
        processing = false;
    }
</script>

<Container>
    <h1>MCID to UUID</h1>
    <hr />
    <div class="main">
        <div class="input">
            <span>MCID</span>
            <input type="text" placeholder="akpc" bind:value={mcid} class:err={error} />
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
            <img src={`https://mc-heads.net/avatar/${result.uuid}/512`} alt="NoLogo" class="logo" />
            <div>
                <span class="name">{result.name}</span>
                <span class="uuid">{result.uuid}</span>
            </div>
        </div>
    {/if}
</Container>

<style>
    .logo {
        width: 80px;
        height: 80px;
    }
    .result {
        display: flex;
        gap: 10px;
        background-image: url("/light_dirt_background.png");
        background-size: 40px;
        padding: 10px;
    }
    .result * {
        font-family: "unifont";
    }
    .result .name {
        font-family: "unifont";
        font-size: 20px;
        margin: 10px 0;
        display: block;
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
