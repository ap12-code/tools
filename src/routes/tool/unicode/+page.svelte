<script>
    import Container from "$components/Container.svelte";

    let plain = $state("");
    let unicode = $state("");

    function changePlain() {
        unicode = "";
        for (let c of plain.split("")) {
            let cn = c.codePointAt(0);
            if (cn) {
                let cr = cn.toString(16).padStart(4, "0");
                unicode += `\\u${cr}`;
            } else {
                unicode = "変換エラー";
                return;
            }
        }
    }
    function changeUnicode() {
        plain = "";
        for (let c of unicode.split("\\u")) {
            if (!c) continue;
            let cn = parseInt(c, 16);
            if (cn) {
                let cr = String.fromCodePoint(cn);
                plain += `${cr}`;
            } else {
                plain = "変換エラー";
                return;
            }
        }
    }
    function exchange() {
        [unicode, plain] = [plain, unicode];
        changePlain();
    }
</script>

<Container>
    <h1>Unicode エンコーダー / デコーダー</h1>
    <hr />
    <div class="main">
        <div>
            <p>テキスト</p>
            <textarea bind:value={plain} oninput={changePlain}></textarea>
        </div>
        <div>
            <button aria-label="入れ替え" onclick={exchange}><i class="bi bi-arrow-down-up"></i></button>
        </div>
        <div>
            <p>UNICODE</p>
            <textarea bind:value={unicode} oninput={changeUnicode}></textarea>
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
