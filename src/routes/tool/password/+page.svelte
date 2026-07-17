<script lang="ts">
    import { browser } from '$app/environment';
    import Container from '$components/Container.svelte';
    import CheckBox from '$components/form/CheckBox.svelte';
    import { onMount } from 'svelte';

    const LOCAL_STORAGE_KEY = 'data:password';

    let output = $state('');
    let amount = $state(40);
    let use_lower = $state(true);
    let use_upper = $state(true);
    let use_digits = $state(true);
    let use_symbols = $state(false);
    let auto_regen = $state(true);

    const LOWERS = 'abcdefghijklmnopqrstuvwxyz';
    const UPPERS = LOWERS.toUpperCase();
    const DIGITS = '0123456789';
    let symboles = $state('!@#$%^&*');

    function gen(manual?: boolean) {
        saveBrowserData();
        if (!manual && !auto_regen) return;

        let chars = '';
        if (use_lower) chars += LOWERS;
        if (use_upper) chars += UPPERS;
        if (use_digits) chars += DIGITS;
        if (use_symbols) chars += symboles;

        output = Array.from(crypto.getRandomValues(new Uint32Array(amount)))
            .map((value) => chars[value % chars.length])
            .join('');
    }

    function copy() {
        navigator.clipboard.writeText(output);
    }

    function updateAutoRegen() {
        if (auto_regen) gen();
    }

    function loadBrowserData() {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            amount = parsed.amount;
            use_lower = parsed.use_lower;
            use_upper = parsed.use_upper;
            use_digits = parsed.use_digits;
            use_symbols = parsed.use_symbols;
            auto_regen = parsed.auto_regen;
        }
    }

    function saveBrowserData() {
        const data = {
            amount,
            use_lower,
            use_upper,
            use_digits,
            use_symbols,
            auto_regen
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }

    if (browser) loadBrowserData();
    onMount(gen);
</script>

<Container>
    <h1>パスワードジェネレーター</h1>
    <hr />
    <div class="main">
        <div class="controls">
            <div class="control-item">
                <label for="amount">文字数</label>
                <input bind:value={amount} oninput={() => gen()} type="number" id="amount" />
            </div>
            <div class="control-item">
                <label for="use-lower">小文字を使用する</label>
                <div>
                    <CheckBox bind:checked={use_lower} onchange={() => gen()} id="use-lower" />
                </div>
            </div>
            <div class="control-item">
                <label for="use-upper">大文字を使用する</label>
                <div>
                    <CheckBox bind:checked={use_upper} onchange={() => gen()} id="use-upper" />
                </div>
            </div>
            <div class="control-item">
                <label for="use-digits">数字を使用する</label>
                <div>
                    <CheckBox bind:checked={use_digits} onchange={() => gen()} id="use-digits" />
                </div>
            </div>
            <div class="control-item">
                <label for="use-symbols">記号を使用する</label>
                <div>
                    <CheckBox bind:checked={use_symbols} onchange={() => gen()} id="use-symbols" />
                </div>
            </div>
            <hr />
            <div class="control-item">
                <label for="auto-regen">自動再生成</label>
                <div>
                    <CheckBox bind:checked={auto_regen} onchange={updateAutoRegen} id="auto-regen" />
                </div>
            </div>
            <button onclick={() => gen(true)}>再生成</button>
        </div>
        <div>
            <textarea bind:value={output} readonly></textarea>
            <button onclick={copy}>コピー</button>
        </div>
    </div>
</Container>

<style>
    .controls {
        display: flex;
        gap: 20px;
        flex-direction: column;
    }
    .control-item {
        display: flex;
        align-items: center;
        width: 100%;
    }
    .control-item input[type='number'] {
        margin-left: auto;
        width: 50%;
        text-align: end;
        font-size: 14px;
    }
    .control-item > div {
        margin-left: auto;
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
