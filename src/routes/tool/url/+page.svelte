<script>
    import Container from "$components/Container.svelte";

    let plain = $state("")
    let urlEncoded = $state("")

    function changePlain() {
        urlEncoded = encodeURIComponent(plain)
    }
    function changeURL() {
        plain = decodeURIComponent(urlEncoded)
    }
    function exchange() {
        [urlEncoded, plain] = [plain, urlEncoded]
        changePlain()
    }
</script>
<Container>
    <h1>URL エンコーダー / デコーダー</h1>
    <hr />
    <div class="main">
        <div>
            <p>テキスト</p>
            <textarea bind:value={plain} oninput={changePlain}></textarea>
        </div>
        <div>
            <button onclick={exchange}><i class="bi bi-arrow-down-up"></i></button>
        </div>
        <div>
            <p>URL</p>
            <textarea bind:value={urlEncoded} oninput={changeURL}></textarea>
        </div>
    </div>
</Container>

<style>
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
        border-radius: 5px;
        color: #fff;
        height: 20vh;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 100%;
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
</style>