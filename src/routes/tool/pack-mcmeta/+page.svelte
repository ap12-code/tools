<script lang="ts">
    import Container from '$components/Container.svelte';
    import CheckBox from '$components/form/CheckBox.svelte';
    import { onMount } from 'svelte';
    import { createPackMcmeta, SpyglassVersion, type PackMcmeta, type SpyglassVersionData, type Version, type VersionType } from './versions.svelte';
    import VersionFilter from '$components/VersionFilter.svelte';
    import { VersionFilterOptions } from '$lib/minecraft/version_filter.svelte';
    import MCText from '$components/MCText.svelte';
    import type { TextData } from '$lib/minecraft/types';

    let description: TextData = $state('');
    let currentType: VersionType = $state('dp');
    let currentMinimumVersion: SpyglassVersion | null = $state(null);
    let currentMaximumVersion: SpyglassVersion | null = $state(null);
    let useMaximumVersion = $state(false);
    let supportRangedVersion = $state(false);
    let search = $state('');
    let output: PackMcmeta | null = $state(null);
    let outJSON = $derived(JSON.stringify(output, null, 4));
    let data: SpyglassVersion[] = $state([]);
    let filteredMinimumVersions: SpyglassVersion[] = $state([]);
    let filteredMaximumVersions: SpyglassVersion[] = $state([]);
    let minimumVersionFilter = $state(new VersionFilterOptions());
    let maximumVersionFilter = $state(new VersionFilterOptions());

    function update() {
        if (!currentMinimumVersion) return;
        supportRangedVersion = currentMinimumVersion.getVersion(currentType)?.supportRanged(currentType) || false;
        output = createPackMcmeta(currentType, currentMinimumVersion, currentMaximumVersion, description);
    }
    function updateType() {
        update();
    }
    function updateMaximum(ver: SpyglassVersion | null) {
        currentMaximumVersion = ver;
        update();
    }
    function updateMinimum(ver: SpyglassVersion | null) {
        currentMinimumVersion = ver;
        updateMaximumSearch();
        update();
    }
    function updateMaximumSearch() {
        filteredMaximumVersions = maximumVersionFilter.apply(data).filter((v) => !v.isNewerThan(currentMinimumVersion!!));

        if (!currentMaximumVersion || !filteredMaximumVersions.includes(currentMaximumVersion)) {
            currentMaximumVersion = filteredMaximumVersions[0];
        }
    }
    function updateMinimumSearch() {
        filteredMinimumVersions = minimumVersionFilter.apply(data);
        currentMinimumVersion = filteredMinimumVersions[0];
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
    async function loadVersions() {
        const resp = await fetch('https://api.spyglassmc.com/mcje/versions', {
            headers: {
                'User-Agent': navigator.userAgent
            }
        });
        data = ((await resp.json()) as SpyglassVersionData[]).map((d) => new SpyglassVersion(d));
        filteredMinimumVersions = Array.from(data);
        filteredMaximumVersions = Array.from(data);
        currentMinimumVersion = filteredMinimumVersions[0];
        updateMinimumSearch();
    }
    onMount(async () => {
        await loadVersions();
        updateType();
        update();
    });
</script>

<Container>
    <h1>pack.mcmetaジェネレーター</h1>
    <hr />
    <div class="main">
        <div class="type control">
            <span>種別</span>
            <select bind:value={currentType} onchange={updateType}>
                <option value="dp">データパック</option>
                <option value="rp">リソースパック</option>
            </select>
        </div>
        <br />
        {#if supportRangedVersion}
            <div class="version control">
                <span>上限を指定</span>
                <CheckBox bind:checked={useMaximumVersion} onchange={updateMaximumSearch} />
            </div>
        {/if}
        <div class="version control">
            <span>{useMaximumVersion ? '下限' : ''}バージョン</span>
            <select bind:value={() => currentMinimumVersion, (v) => updateMinimum(v)}>
                {#each filteredMinimumVersions as version}
                    <option value={version}>{version.name}</option>
                {/each}
            </select>
            <input type="text" placeholder="検索" bind:value={minimumVersionFilter.keyword} oninput={updateMinimumSearch} />
            <VersionFilter
                apply={updateMinimumSearch}
                title={`${useMaximumVersion ? '下限' : ''}バージョンのフィルタ`}
                bind:filter={minimumVersionFilter}
            />
        </div>
        {#if useMaximumVersion}
            <div class="version control">
                <span>上限バージョン</span>
                <select bind:value={() => currentMaximumVersion, (v) => updateMaximum(v)}>
                    {#key filteredMaximumVersions}
                        {#each filteredMaximumVersions as version}
                            <option value={version}>{version.name}</option>
                        {/each}
                    {/key}
                </select>
                <input type="text" placeholder="検索" bind:value={search} oninput={updateMaximumSearch} />
                <VersionFilter apply={updateMaximumSearch} title={`上限バージョンのフィルタ`} bind:filter={maximumVersionFilter} />
            </div>
        {/if}
        <br />
        <div class="description control">
            <span>説明</span>
            <MCText bind:data={description} {update} />
        </div>
    </div>
    <hr />
    <div>
        <p>出力</p>
        {#if output == null}
            <textarea class="output" readonly>バージョンを指定してください...</textarea>
        {:else}
            <textarea class="output" bind:value={outJSON} readonly></textarea>
            <button onclick={download}>ダウンロード</button>
            <button onclick={copy}>コピー</button>
        {/if}
    </div>
</Container>

<style>
    .main span {
        margin-right: auto;
        width: 50%;
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
