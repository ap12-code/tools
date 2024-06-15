<script lang="ts">
    import Container from "$components/Container.svelte";

    let amount = 4
    let max = 5
    let min = 1
    let randoms: string[] = []
    function gen() {
        if (amount <= 0) amount = 1
        randoms = []
        for (let i = 0; i < amount; i++) {
            let random: string = Math.floor(Math.random() * (max - min) + min).toString();
            randoms.push(random)
        }
    }
    function copy(data: string) {
        navigator.clipboard.writeText(data)
    }
    gen()
</script>
<Container>
    <h1>ランダム整数ジェネレーター</h1>
    <hr />
    <div class="main">
        <div>
            <div class="controls">
                <div class="counts">
                    <label for="amount">生成数</label>
                    <input bind:value={amount} on:change={gen} min={1} max={50} type="number" id="amount">
                </div>
                <div class="counts">
                    <label for="max">最大</label>
                    <input bind:value={max} on:change={gen} min={min} type="number" id="max">
                </div>
                <div class="counts">
                    <label for="min">最小</label>
                    <input bind:value={min} on:change={gen} max={max} type="number" id="min">
                </div>
                <button on:click={gen}>再生成</button>
            </div>
            {#each randoms as random}
                <div class="item">
                    <textarea readonly bind:value={random}></textarea>
                    <button on:click={_ => copy(random)}>コピー</button>
                </div>
            {/each}
        </div>
    </div>
</Container>

<style>
    .controls {
        display: flex;
        gap: 20px;
        align-items: center;
    }
    .counts > input {
        background-color: #222;
        padding: 5px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 24px;
    }
    .counts {
        height: 100%;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    textarea {
        flex-grow: 1;
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
        font-size: 14px;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 20%;
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
    .item {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        height: 30px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>