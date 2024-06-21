<script lang="ts">
    import Container from "$components/Container.svelte";

    let files: FileList;
    let to_ext = "png";
    let has_result = false;
    let processing = false;
    let err = false;
    let imgSrc: string[] = [];

    const IMG_FORMATS = [
        "heic",
        "heif",
        "avif",
        "jpeg",
        "jpg",
        "jpe",
        "tile",
        "dz",
        "png",
        "raw",
        "tiff",
        "tif",
        "webp",
        "gif",
        "jp2",
        "jpx",
        "j2k",
        "j2c",
        "jxl",
    ];

    async function run() {
        if (!files) return;
        has_result = false;
        processing = true;
        err = false;
        for (let file of files) {
            const fd = new FormData();
            fd.append("uploadfile", file);
            const resp = await fetch(`/tool/image/convert?to=${to_ext}`, {
                body: fd,
                method: "POST",
            });
            if (resp.ok) {
                imgSrc.push(URL.createObjectURL(await resp.blob()));
                has_result = true;
            } else {
                err = true;
            }
        }
        processing = false;
    }

    function download() {
        const a = document.createElement("a");
        for (const imgSr of imgSrc) {
            a.href = imgSr;
            a.download = `${crypto.randomUUID()}.${to_ext}`;
            a.click();
        }
    }
</script>

<Container>
    <h1>画像形式変換</h1>
    <hr />
    <div class="main">
        <div>
            <p>入力</p>
            <input class="file-input" type="file" bind:files multiple on:input={run} />
        </div>
        <hr />
        <div>
            <p>形式</p>
            <select on:input={run} bind:value={to_ext}>
                {#each IMG_FORMATS as fmt}
                    <option value={fmt}>{fmt}</option>
                {/each}
            </select>
        </div>
        <button on:click={run}><i class="bi bi-arrow-down" /> 変換</button>
        <hr />
        <div>
            <p>出力</p>
            {#if processing}
                <p>変換中...</p>
            {:else if has_result}
                {#each imgSrc as imgS}
                    <img alt="変換失敗" src={imgS} />
                {/each}
                <div class="out-control">
                    <button on:click={download}>ダウンロード</button>
                </div>
            {:else if err}
                <p class="err">変換に失敗しました。</p>
            {:else}
                <span>変換を開始してください...</span>
            {/if}
        </div>
    </div>
</Container>

<style>
    .err {
        color: #d00;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .out-control {
        margin: 10px 0;
    }
    .file-input::file-selector-button {
        padding: 5px;
        display: block;
        background-color: #222;
        width: 200px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        transition: 0.2s all;
    }
    .file-input::file-selector-button:hover {
        background-color: #666;
        transition: 0.2s all;
        cursor: pointer;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 200px;
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
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    select {
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        outline: none;
        width: 300px;
    }
    img {
        width: 300px;
    }
</style>
