<script lang="ts">
    import { page } from '$app/state';
    import Container from '$components/Container.svelte';
    import Text from '$components/form/Text.svelte';
    import { onMount } from 'svelte';
    let mcid = $state('');
    let result: Record<string, any> = $state({
        players: {}
    });
    let error: string | null = $state(null);
    let processing = $state(false);
    let has_result = $state(false);

    async function run() {
        processing = true;
        has_result = false;
        error = null;
        const resp = await fetch(`/tool/mcid/lookup`, {
            method: 'POST',
            body: JSON.stringify({
                mcid: mcid
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (resp.ok) {
            result = await resp.json();
            has_result = true;
        } else if (resp.status == 404) {
            error = 'プレイヤーが見つかりません';
        } else if (resp.status == 400) {
            error = 'MCIDまたはUUIDが無効です。';
        }
        processing = false;
    }

    onMount(() => {
        if (page.url.searchParams.has('q')) {
            mcid = page.url.searchParams.get('q')!!;
            run();
        }
    });
</script>

<Container>
    <h1>MCID to UUID</h1>
    <hr />
    <div class="main">
        <div class="input">
            <span>MCID</span>
            <Text placeholder="akpc" bind:value={mcid} error_message={error} error={error != null} />
        </div>
        <div>
            <button onclick={(_) => run()}>実行</button>
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
        background-image: url('/light_dirt_background.png');
        background-size: 40px;
        padding: 10px;
    }
    .result * {
        font-family: 'unifont';
    }
    .result .name {
        font-family: 'unifont';
        font-size: 20px;
        margin: 10px 0;
        display: block;
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
