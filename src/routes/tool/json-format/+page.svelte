<script lang="ts">
    import Button from "$components/Button.svelte";
    import Container from "$components/Container.svelte";

    let formatted = $state("")
    let error = $state(false)
    let input = $state("")

    let mode = $state("none")
    let spaces = $state(4)
    let spaces_error = $state(false)
    let tabs = $state(1)
    let tabs_error = false
    let custom_indent = $state("")
    let copy_btn = $state("コピー")

    function changeMode(_mode: string) {
        mode = _mode
        changeInput()
    }

    function changeInput() {
        error = false
        spaces_error = false
        tabs_error = false

        if (input == "") {
            formatted = ""
            return
        }

        let indent = ""
        switch (mode) {
            case "none":
                indent = ""
                break
            case "spaces":
                if (spaces <= 0) {
                    spaces_error = true
                    return
                }
                indent = " ".repeat(spaces)
                break
            case "tabs":
                if (tabs <= 0) {
                    tabs_error = true
                    return
                }
                indent = "\t".repeat(tabs)
                break
            case "custom":
                indent = custom_indent
                break
        }

        try {
            formatted = JSON.stringify(
                JSON.parse(input.trim()),
                null, indent
            )
        } catch {
            error = true
        }
    }

    function copy() {
        navigator.clipboard.writeText(formatted).then(() => {
            copy_btn = "コピーしました"
            setTimeout(() => {
                copy_btn = "コピー"
            }, 1000)
        })
    }
</script>
<Container>
    <h1>JSONフォーマッター</h1>
    <hr />
    <div class="main">
        <div>
            <p>JSON</p>
            <textarea bind:value={input} oninput={changeInput}></textarea>
            {#if error && input != ""}
                <p class="error">無効なJSONです</p>
            {/if}
        </div>
        <div class="indent-menu">
            <div>
                <input type="radio" id="radio-0" name="radio" checked={mode == "none"} oninput={_ => changeMode("none")}>
                <label for="radio-0">1行にまとめる</label>
            </div>
            <div>
                <input type="radio" id="radio-1" name="radio" checked={mode == "spaces"} onchange={_ => changeMode("spaces")}>
                <input type="number" class:error={spaces_error} min={1} max={99} bind:value={spaces} oninput={changeInput}>
                <label for="radio-1">スペース</label>
            </div>
            <div>
                <input type="radio" id="radio-2" name="radio" checked={mode == "tabs"} onchange={_ => changeMode("tabs")}>
                <input type="number" min={1} max={99} bind:value={tabs} oninput={changeInput}>
                <label for="radio-2">タブ</label>
            </div>
            <div>
                <input type="radio" id="radio-3" name="radio" checked={mode == "custom"} onchange={_ => changeMode("custom")}>
                <label for="radio-3">カスタム</label>
                {#if mode == "custom"}
                    <input type="text" bind:value={custom_indent} oninput={changeInput}>
                {/if}
            </div>
        </div>
        <div>
            <div class="result">
                <p>整形済みJSON</p>
                <div class="result-action">
                    <Button on:click={copy}><i class="bi bi-clipboard2"></i> {copy_btn}</Button>
                </div>
            </div>
            <div class="output">{formatted}</div>
        </div>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .indent-menu {
        display: flex;
        gap: 40px;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
        height: 20vh;
        outline: none;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    .result {
        display: flex;
        align-items: center;
    }
    .result-action  {
        margin-left: auto;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
        width: 50px;
        text-align: right;
    }
    input[type="number"]:not(.error), input[type="text"]:not(.error) {
        border: #666 1px solid;
    }
    input[type="number"], input[type="text"] {
        background-color: #222;
        padding: 5px;
        border-radius: 5px;
        color: #fff;
        height: 14px;
        outline: none;
    }
    input[type="radio"] {
        position: relative;
        border: #666 1px solid;
        color: #fff;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        appearance: none;
        vertical-align: -3px;
    }
    input[type="radio"]:checked:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #999;
    }
    .output {
        display: block;
        background-color: #111;
        padding: 10px;
        border-radius: 5px;
        height: 200px;
        font-family: monospace;
        white-space: break-spaces;
    }
    input.error {
        border: red 1px solid;
    }
    p.error {
        color: #f00;
        font-size: 13px;
        display: inline;
    }
</style>