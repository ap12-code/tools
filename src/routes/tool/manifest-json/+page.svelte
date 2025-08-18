<script lang="ts">
    import Container from '$components/Container.svelte';
    import { onMount } from 'svelte';
    let dataVersion = '';
    type Module = {
        description: string;
        type: string;
        uuid: string;
        version: string;
    };

    const MODULE_TYPES = ['resources', 'data', 'script', 'world_template'];
    const LICENSE_TYPES = {
        'The Unlicense': '',
        'MIT License': 'MIT',
        'GNU AGPLv3': 'AGPLv3',
        'GNU GPLv3': 'GPLv3',
        'GNU LGPLv3': 'LGPLv3',
        'Mozilla Public License 2.0': 'MPL2.0',
        'Apache License 2.0': 'Apache2.0'
    };

    let modules: Module[] = $state([]);
    let output = $state({
        format_version: 2,
        header: {
            name: '',
            description: '',
            uuid: crypto.randomUUID(),
            version: '0.1.0',
            min_engine_version: '1.21.0'
        },
        modules: [] as Module[],
        dependencies: [],
        capabilities: [],
        metadata: {
            authors: [],
            url: '',
            license: 'v1.0'
        }
    });
    let outJSON = $state('');

    function update() {
        output.modules = modules;
        for (let mod of output.modules) {
            mod.version = output.header.version;
        }
        outJSON = JSON.stringify(output, null, 4);
    }
    function copy() {
        navigator.clipboard.writeText(outJSON);
    }
    function download() {
        const url = URL.createObjectURL(
            new Blob([outJSON], {
                type: 'text/plain'
            })
        );
        const element = document.createElement('a');
        element.href = url;
        element.download = 'pack.mcmeta';
        element.click();
    }
    function add_module() {
        modules.push({
            description: output.header.description,
            type: 'resources',
            uuid: crypto.randomUUID(),
            version: ''
        });
        modules = modules;
        update();
    }

    function del_module(id: string) {
        modules = modules.filter((p) => p.uuid != id);
        update();
    }

    onMount(update);
</script>

<Container>
    <h1>manifest.jsonジェネレーター</h1>
    <hr />
    <div class="main">
        <p>ヘッダー</p>
        <div class="control">
            <span>パック名</span>
            <input type="text" bind:value={output.header.name} oninput={update} />
        </div>
        <div class="control">
            <span>説明</span>
            <input type="text" bind:value={output.header.description} oninput={update} />
        </div>
        <div class="control">
            <span>バージョン</span>
            <input type="text" bind:value={output.header.version} oninput={update} />
        </div>
        <div class="control">
            <span>ゲームバージョン</span>
            <input type="text" bind:value={output.header.min_engine_version} oninput={update} />
        </div>
        <hr />
        <p>メタデータ</p>
        <div class="control">
            <span>制作者</span>
            <input type="text" bind:value={output.metadata.authors[0]} oninput={update} />
        </div>
        <div class="control">
            <span>URL</span>
            <input type="text" bind:value={output.metadata.url} oninput={update} />
        </div>
        <div class="control">
            <span>ライセンス</span>
            <select bind:value={output.metadata.license} onchange={update}>
                {#each Object.entries(LICENSE_TYPES) as [k, v]}
                    <option value={v}>{k}</option>
                {/each}
            </select>
        </div>
        <hr />
    </div>
    <div class="main">
        <p>モジュール</p>
        {#each modules as module}
            <div class="module">
                <div class="control">
                    <span>説明</span>
                    <input type="text" bind:value={module.description} oninput={update} />
                </div>
                <div class="control">
                    <span>種別</span>
                    <select bind:value={module.type} onchange={update}>
                        {#each MODULE_TYPES as type}
                            <option value={type}>{type}</option>
                        {/each}
                    </select>
                </div>
                <div class="control">
                    <span></span>
                    <button class="delete-button" onclick={(_) => del_module(module.uuid)}>削除</button>
                </div>
            </div>
        {/each}
        <div class="control">
            <span></span>
            <button onclick={add_module}><i class="bi bi-plus-lg"></i> 追加</button>
        </div>
    </div>
    <hr />
    <div>
        <p>出力</p>
        {#key dataVersion}
            <textarea class="output" value={outJSON} readonly></textarea>
        {/key}
        <button onclick={download}>ダウンロード</button>
        <button onclick={copy}>コピー</button>
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
    .module {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .output {
        height: 400px;
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
        width: 150px;
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
    .delete-button {
        background-color: #b00;
        width: 100px;
    }
    .delete-button:hover {
        background-color: #900;
        width: 100px;
    }
</style>
