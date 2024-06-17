<script>
    import Container from "$components/Container.svelte";

    let output = ""
    let amount = 40
    let use_lower = true
    let use_upper = true
    let use_digits = true
    let use_symbols = false

    const LOWERS = "abcdefghijklmnopqrstuvwxyz"
    const UPPERS = LOWERS.toUpperCase()
    const DIGITS = "0123456789"
    const SYMBOLS = "!@#$%^&*"

    function gen() {
        let chars = ""
        output = ""
        if (use_lower) chars += LOWERS
        if (use_upper) chars += UPPERS
        if (use_digits) chars += DIGITS
        if (use_symbols) chars += SYMBOLS
        for (let i = 0; i < amount; i++) {
            output += chars.charAt(Math.floor(Math.random() * chars.length))
        }
    }
    function copy() {
        navigator.clipboard.writeText(output)
    }
</script>
<Container>
    <h1>パスワードジェネレーター</h1>
    <hr />
    <div class="main">
        <div class="controls">
            <div class="control-item">
                <label for="amount">文字数</label>
                <input bind:value={amount} on:input={gen} type="number" id="amount">
            </div>
            <div class="control-item">
                <label for="use-lower">小文字を使用する</label>
                <input bind:checked={use_lower} on:change={gen} type="checkbox" class="checkbox" id="use-lower">
            </div>
            <div class="control-item">
                <label for="use-lower">大文字を使用する</label>
                <input bind:checked={use_upper} on:change={gen} type="checkbox" class="checkbox" id="use-lower">
            </div>
            <div class="control-item">
                <label for="use-lower">数字を使用する</label>
                <input bind:checked={use_digits} on:change={gen} type="checkbox" class="checkbox" id="use-lower">
            </div>
            <div class="control-item">
                <label for="use-lower">記号を使用する</label>
                <input bind:checked={use_symbols} on:change={gen} type="checkbox" class="checkbox" id="use-lower">
            </div>
            <button on:click={gen}>再生成</button>
        </div>
        <div>
            <textarea bind:value={output} readonly></textarea>
            <button on:click={copy}>コピー</button>
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
    .control-item > input[type="checkbox"] {
        margin-left: auto;
        text-align: end;
    }
    .checkbox {
        cursor: pointer;
        appearance: none;
        height: 24px;
        width: 24px;
        margin: 4px;
        border: 1px solid #8b98a5;
        border-radius: 4px;
    }
    .checkbox:checked {
        border: 1px solid #8b98a5;
        background-color: #fff;
    }
    .checkbox:checked::before {
        display: grid;
        place-content: center;
        color: #000;
        height: 100%;
        font-family: "bootstrap-icons";
        font-size: 18px;
        content: "\F633";
    }
    .checkbox:focus-visible {
        outline: none;
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