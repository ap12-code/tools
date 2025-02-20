<script>
    import Container from "$components/Container.svelte";

    let output = $state("")
    let amount = $state(0)

    function update() {
        amount = Array.from(output).length
    }
</script>
<Container>
    <h1>文字数カウンタ</h1>
    <hr />
    <div class="main">
        <div class="controls">
            <div class="control-item">
                <label for="amount">文字数</label>
                <input readonly bind:value={amount} type="number" id="amount">
            </div>
        </div>
        <div>
            <textarea bind:value={output} oninput={update}></textarea>
        </div>
    </div>
</Container>

<style>
    .controls {
        display: flex;
        gap: 20px;
        align-items: center;
        flex-direction: column;
    }
    .control-item {
        display: flex;
        align-items: center;
        width: 100%;
    }
    .control-item > input[type="number"] {
        margin-left: auto;
        width: 50%;
        text-align: end;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        display: inline;
        position: relative;
        border-radius: 5px;
        color: #fff;
        height: 20vh;
    }
    input {
        background-color: #222;
        padding: 5px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 24px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>