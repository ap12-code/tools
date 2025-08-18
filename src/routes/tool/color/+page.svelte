<script lang="ts">
    import Container from '$components/Container.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import ColorPicker from 'svelte-awesome-color-picker';
    import Button from '$components/Button.svelte';

    let input = 'https://komaken.net';
    let err: string = '';
    let forecol = $state({
        r: 255,
        g: 255,
        b: 255,
        a: 1
    });
    let backcol = $state({
        r: 0,
        g: 0,
        b: 0,
        a: 1
    });
    function update() {
        err = '';
        const canv = document.getElementById('output');
        if (!canv || !(canv instanceof HTMLDivElement)) return;
        canv.style.backgroundColor = `rgb(${backcol.r} ${backcol.g} ${backcol.b} / ${backcol.a})`;
        canv.style.color = `rgb(${forecol.r} ${forecol.g} ${forecol.b} / ${forecol.a})`;
    }
    function randInt(): number {
        return Math.floor(Math.random() * (255 - 0) + 0);
    }
    function randomfg() {
        forecol.r = randInt();
        forecol.g = randInt();
        forecol.b = randInt();
    }
    function randombg() {
        backcol.r = randInt();
        backcol.g = randInt();
        backcol.b = randInt();
    }
    onMount(() => {
        input = $page.url.origin;
        update();
    });
</script>

<Container>
    <h1>カラーピッカー</h1>
    <hr />
    <div class="main">
        <div class="output" id="output">
            <h3>Heading</h3>
            <span id="out2" class="out-fore">
                Veniam pariatur qui occaecat pariatur ad voluptate ad velit sunt enim pariatur deserunt ad anim sit. Aliquip consequat incididunt elit
                tempor velit ea sint esse magna pariatur elit et sunt mollit consectetur. Laboris ea irure id do id commodo. Et id eu laborum ut
                occaecat amet do aliquip non exercitation. Nulla minim cillum anim officia deserunt nostrud laborum do id. Duis eiusmod officia
                nostrud do in culpa dolor. Dolore ullamco adipisicing mollit officia dolor Lorem ex cillum deserunt exercitation adipisicing
                exercitation et incididunt. Nisi veniam ex laborum sit sint labore in do nostrud ut aliqua aliqua deserunt.
            </span>
        </div>
        <hr />
        <div class="colors">
            <p>色</p>
            <div class="color">
                <ColorPicker label="文字の色" bind:rgb={forecol} on:input={update} />
                <Button onclick={randomfg}>ランダム</Button>
            </div>
            <div class="color">
                <ColorPicker label="背景の色" bind:rgb={backcol} on:input={update} />
                <Button onclick={randombg}>ランダム</Button>
            </div>
        </div>
        <hr />
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
        overflow: hidden;
        width: 100%;
    }
    .out-fore {
        margin: 10px;
        display: block;
    }
    h3 {
        margin: 5px 10px;
        display: block;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    .color {
        margin: 20px 0;
    }
</style>
