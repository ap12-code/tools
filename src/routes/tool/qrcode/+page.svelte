<script lang="ts">
    import Container from '$components/Container.svelte';
    import QRCode from 'qrcode';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import ColorPicker from 'svelte-awesome-color-picker';

    let input = $state('https://komaken.net');
    let err: string = $state('');
    let backcol = $state('#ffffffff');
    let forecol = $state('#00000000');
    function update() {
        err = '';
        backcol = backcol.substring(0, 7);
        forecol = forecol.substring(0, 7);
        const canv = document.getElementById('output');
        if (!canv || !(canv instanceof HTMLCanvasElement)) return;
        const ctx = canv.getContext('2d');
        if (!ctx) return;
        if (!input) {
            ctx.clearRect(0, 0, canv.width, canv.height);
        } else {
            QRCode.toCanvas(
                input,
                {
                    width: 200,
                    color: { dark: forecol, light: backcol }
                },
                (err2, canvas) => {
                    if (err2) err = err2.toString();
                    ctx.drawImage(canvas, 0, 0, canv.width, canv.height);
                }
            );
        }
    }
    function copy() {
        const canv = document.getElementById('output');
        if (!canv || !(canv instanceof HTMLCanvasElement)) return;
        const ctx = canv.getContext('2d');
        if (!ctx) return;
        canv.toBlob((bl) => {
            if (!bl) return;
            navigator.clipboard.write([new ClipboardItem({ 'image/png': bl }, {})]);
        });
    }
    function download() {
        const canv = document.getElementById('output');
        if (!canv || !(canv instanceof HTMLCanvasElement)) return;
        const ctx = canv.getContext('2d');
        if (!ctx) return;
        canv.toBlob((bl) => {
            if (!bl) return;
            const url = URL.createObjectURL(
                new Blob([bl], {
                    type: 'image/png'
                })
            );
            const element = document.createElement('a');
            element.href = url;
            element.download = 'qrcode.png';
            element.click();
        });
    }
    onMount(() => {
        input = $page.url.origin;
        update();
    });
</script>

<Container>
    <h1>QRコードジェネレーター</h1>
    <hr />
    <div class="main">
        <div>
            <span>データ</span>
            <input type="text" bind:value={input} oninput={update} />
        </div>
        <div class="colors">
            <p>色</p>
            <ColorPicker label="前側の色" bind:hex={forecol} on:input={update} />
            <ColorPicker label="後側の色" bind:hex={backcol} on:input={update} />
        </div>
        <hr />
        <span>出力</span>
        <canvas class="output" id="output" width={200} height={200}></canvas>
        {#if err}
            <p>{err}</p>
        {/if}
        <button onclick={copy}>コピー</button>
        <button onclick={download}>ダウンロード</button>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
        --cp-bg-color: #222;
        --cp-border-color: #666;
        --cp-text-color: white;
        --cp-input-color: #333;
        --cp-button-hover-color: #777;
    }
    .output {
        height: 200px;
        width: 200px;
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
        width: 100%;
        box-sizing: border-box;
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
