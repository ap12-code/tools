<script lang="ts">
    import Container from "$components/Container.svelte";
    import QRCode from "qrcode"

    let amount = 4
    let input = "https://komaken.net"
    let data = ""
    let err = ""
    function update() {
        QRCode.toCanvas(input, { version: 2 }, (err, canvas) => {
            err = err
            const canv = document.getElementById("output")
            if (!canv || !(canv instanceof HTMLCanvasElement)) return
            const context = canv.getContext("2d")
            if (!context) return
            context
        })
    }
    function copy(data: string) {
        navigator.clipboard.writeText(data)
    }
</script>
<Container>
    <h1>QRコードジェネレーター</h1>
    <hr />
    <div class="main">
        <div>
            <span>データ</span>
            <input type="text" bind:value={input} on:input={update} />
        </div>
        <hr />
        <span>出力</span>
        <canvas class="output" id="output"></canvas>
        {#if err}
            <p>{err}</p>
        {/if}
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
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
</style>