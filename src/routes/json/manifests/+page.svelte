<script lang="ts">
    import Container from "$components/Container.svelte";
    let dataVersion = ""
    let modules = [
        {
            description: "",
            type: "",
            uuid: crypto.randomUUID(),
            version: ""
        }
    ]
    let output = {
        "format_version": 2,
        "header": {
            "name": "",
            "description": "",
            "uuid": crypto.randomUUID(),
            "version": "0.1.0",
            "min_engine_version": "1.21.0"
        },
        "modules": modules,
        "dependencies": [],
        "capabilities": [],
        "metadata":{
            "authors": [],
            "url": "http://tokamcwin10.blog.jp/",
            "license": "v1.0"
        }
    }
    let outJSON = ""

    function update() {
        outJSON = JSON.stringify(output, null, 4)
    }
    function copy() {
        navigator.clipboard.writeText(outJSON)
    }
    function download() {
        const url = URL.createObjectURL(new Blob([outJSON], {
            type: "text/plain"
        }))
        const element = document.createElement("a")
        element.href = url
        element.download = "pack.mcmeta"
        element.click()
    }
    function add_module() {
        modules.push({
            description: "",
            type: "",
            uuid: crypto.randomUUID(),
            version: ""
        })
    }
</script>
<Container>
    <h1>manifest.jsonジェネレーター</h1>
    <hr />
    <div class="main">
        <p>ヘッダー</p>
        <div class="control">
            <span>パック名</span>
            <input type="text" bind:value={output.header.name} on:input={update} />
        </div>
        <div class="control">
            <span>説明</span>
            <input type="text" bind:value={output.header.description} on:input={update} />
        </div>
        <div class="control">
            <span>バージョン</span>
            <input type="text" bind:value={output.header.version} on:input={update} />
        </div>
        <div class="control">
            <span>ゲームバージョン</span>
            <input type="text" bind:value={output.header.min_engine_version} on:input={update} />
        </div>
    </div>
    <hr />
    <div class="main">
        <p>モジュール</p>
        {#each modules as module}
            <div>
                <div class="control">
                    <span>説明</span>
                    <input type="text" bind:value={module.description} on:input={update} />
                </div>
                <div class="control">
                    <span>種別</span>
                    <select bind:value={module.type} on:input={update}>
                        <option></option>
                    </select>
                </div>
            </div>
        {/each}
        <button on:click={add_module}><i class="bi bi-plus-lg"></i> 追加</button>
    </div>
    <hr />
    <div>
        <p>出力</p>
        {#key dataVersion}
            <textarea class="output" bind:value={outJSON} readonly></textarea>
        {/key}
        <button on:click={download}>ダウンロード</button>
        <button on:click={copy}>コピー</button>
    </div>
</Container>

<style>
    .main span {
        width: 150px;
        text-align: right;
    }
    @media (max-width: 720px) {
        .main span {
            width: auto;
            display: block;
            text-align: left;
        }
        .control {
            flex-direction: column;
        }
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .output {
        height: 20vh;
    }
    .control {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .control > input {
        flex-grow: 1;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
    }
    select {
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        outline: none;
        width: 300px;
    }
    input {
        background-color: #222;
        padding: 5px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 18px;
        outline: none;
        width: 300px;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 20%;
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