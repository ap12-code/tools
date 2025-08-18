<script lang="ts">
    import Container from '$components/Container.svelte';
    let ip = $state('');
    let result: Record<string, any> = $state({
        players: {}
    });
    let error = $state(false);
    let processing = $state(false);
    let has_result = $state(false);

    async function run() {
        processing = true;
        has_result = false;
        error = false;
        const resp = await fetch(`/api/mcsrvstat?server=${ip}`);

        if (resp.ok) {
            result = await resp.json();
            console.log(result);
            result.description = parseText(result.description);
            has_result = true;
        } else {
            error = true;
        }
        processing = false;
    }

    const COLOR_MAPPING: Record<string, string> = {
        0: 'color: #000',
        1: 'color: #00a',
        2: 'color: #0a0',
        3: 'color: #0aa',
        4: 'color: #a00',
        5: 'color: #a0a',
        6: 'color: #fa0',
        7: 'color: #aaa',
        8: 'color: #555',
        9: 'color: #55f',
        a: 'color: #5f5',
        b: 'color: #5ff',
        c: 'color: #f55',
        d: 'color: #f5f',
        e: 'color: #ff5',
        f: 'color: #fff'
    };

    function parseText(text: any): string {
        if (!text) return '';
        if (typeof text === 'string') {
            let a = '';
            for (let str of text.split('§')) {
                if (!str) continue;
                a += str.replace(str, `<span style="${COLOR_MAPPING[str.at(0) || 'f'] || ''}; font-family: unifont;">${str.substring(1)}</span>`);
            }
            a = a.replaceAll('\n', '<br />');
            return a || '';
        }
        if (text instanceof Object) {
            let a = '';
            a += `<span style="color: ${text.color || ''}; font-family: unifont;">${text.text || ''}</span>`;
            for (let extra of [...text.extra, ...text.extra.flatMap((p: any) => p.extra)]) {
                if (extra) {
                    a += `<span style="color: ${extra.color}; font-family: unifont;">${extra.text || ''}</span>`;
                }
            }
            return a || '';
        }
        return '';
    }
</script>

<Container>
    <h1>MCサーバーステータス</h1>
    <p>TCPShieldとかCloudflareとか通ってるところは取得できないことがあります。ご了承ください</p>
    <hr />
    <div class="main">
        <div class="input">
            <span>IPアドレス / ドメイン</span>
            <input type="text" placeholder="サーバーアドレス..." bind:value={ip} class:err={error} />
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
            <img src={result.favicon || '/unknown_server.png'} alt="NoLogo" class="logo" />
            <div>
                <span class="description">{@html result.description}</span>
            </div>
            <div class="playercount">
                <span>{result.version.name}</span><br />
                <span>{result.players.online}/{result.players.max}</span>
            </div>
        </div>
    {/if}
    {#if error}
        <p>サーバー情報取得中にエラーが発生しました</p>
    {/if}
</Container>

<style>
    .logo {
        width: 80px;
        height: 80px;
    }
    .playercount {
        margin-left: auto;
        text-align: right;
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
