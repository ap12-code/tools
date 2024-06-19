<script>
    import Container from "$components/Container.svelte";
    import { LoremIpsum } from "lorem-ipsum";
    import { onMount } from "svelte";

    let output = "";
    let amount = 1;
    let type = "paragraph";
    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4,
        },
        wordsPerSentence: {
            max: 16,
            min: 4,
        },
    });

    function gen() {
        switch (type) {
            case "word":
                output = lorem.generateWords(amount);
                break;
            case "paragraph":
                output = lorem.generateParagraphs(amount);
                break;
            case "sentence":
                output = lorem.generateSentences(amount);
                break;
        }
    }
    function copy() {
        navigator.clipboard.writeText(output);
    }

    onMount(gen);
</script>

<Container>
    <h1>Lorem Ipsumジェネレーター</h1>
    <p>ダミーテキスト作るマン</p>
    <hr />
    <div class="main">
        <div class="controls">
            <div class="control-item">
                <label for="amount">長さ</label>
                <input bind:value={amount} min={1} on:input={gen} type="number" id="amount" />
            </div>
            <div class="control-item">
                <label for="type">種類</label>
                <select id="type" bind:value={type}>
                    <option value="word">単語</option>
                    <option value="paragraph">段落</option>
                    <option value="sentence">文</option>
                </select>
            </div>
            <button on:click={gen}>再生成</button>
        </div>
        <div>
            <textarea bind:value={output}></textarea>
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
    .control-item > input,
    select {
        margin-left: auto;
        width: 50%;
    }
    input[type="number"] {
        text-align: end;
    }
    select {
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        outline: none;
        width: 300px;
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
