<script lang="ts">
    import Container from "$components/Container.svelte";
  import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

  interface Props {
    data: PageServerData;
  }

  let { data }: Props = $props();
    let description = $state("")
    let types = $state("dp")
    let dataVersion = $state("")
    let search = $state("")
    let output = {
        pack: {
            pack_format: 0,
            description: description
        }
    }
    let outJSON = $state("")
    let versions: [string, number][] = $state([])

    function update() {
        output.pack.pack_format = data.versions[types][dataVersion]
        output.pack.description = description
        outJSON = JSON.stringify(output, null, 4)
    }
    function updateType() {
        versions = Object.entries(data.versions[types]).sort((a, b) => a[1] - b[1]).toReversed()
        dataVersion = versions[0][0]
        update()
    }
    function updateSearch() {
        versions = Object.entries(data.versions[types])
        .filter(p => p[0].startsWith(search))
        .sort((a, b) => a[1] - b[1])
        .toReversed()

        if (!versions.find(p => p[0] == dataVersion)) {
            dataVersion = versions[0][0]
        }
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
    onMount(() => {
        updateType()
        update()
    })
</script>
<Container>
    <h1>pack.mcmetaジェネレーター</h1>
    <hr />
    <div class="main">
        <div class="type control">
            <span>種別</span>
            <select bind:value={types} onchange={updateType}>
                <option value="dp">データパック</option>
                <option value="rp">リソースパック</option>
            </select>
        </div>
        <div class="version control">
            <span>バージョン</span>
            <select bind:value={dataVersion} onchange={update}>
                {#key versions}
                    {#each versions as [k, v]}
                        <option value={k}>{k}</option>
                    {/each}
                {/key}
            </select>
            <input type="text" placeholder="検索" bind:value={search} oninput={updateSearch}>
        </div>
        <div class="description control">
            <span>説明</span>
            <input type="text" bind:value={description} oninput={update} />
        </div>
    </div>
    <hr />
    <div>
        <p>出力</p>
        {#key dataVersion}
            <textarea class="output" bind:value={outJSON} readonly></textarea>
        {/key}
        <button onclick={download}>ダウンロード</button>
        <button onclick={copy}>コピー</button>
    </div>
</Container>

<style>
    .main span {
        width: 100px;
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
    .version {
        display: flex;
        align-items: center;
        gap: 10px;
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
    .description > input {
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