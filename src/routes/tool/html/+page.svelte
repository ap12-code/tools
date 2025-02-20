<script>
    import Container from "$components/Container.svelte";

    let plain = $state("");
    let html = $state("");

    function changePlain() {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = plain;
        html = textArea.innerHTML;
    }
    function changeHTML() {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = html;
        plain = textArea.value;
    }
    function exchange() {
        [html, plain] = [plain, html];
        changeHTML();
    }
</script>

<Container>
    <h1>HTML エンコーダー / デコーダー</h1>
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
            <p>HTML</p>
            <textarea bind:value={html} oninput={changeHTML}></textarea>
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
