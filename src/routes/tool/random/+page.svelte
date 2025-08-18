<script lang="ts">
    import Container from '$components/Container.svelte';

    let amount = $state(4);
    let max = $state(100);
    let min = $state(1);
    let randoms: string[] = $state([]);
    function gen() {
        if (amount <= 0) amount = 1;
        randoms = [];
        for (let i = 0; i < amount; i++) {
            let random: string = Math.floor(Math.random() * (max - min) + min).toString();
            randoms.push(random);
        }
    }
    function copy(data: string) {
        navigator.clipboard.writeText(data);
    }
    gen();
</script>

<Container>
    <h1>ランダム整数ジェネレーター</h1>
    <hr />
    <div class="main">
        <div>
            <div class="controls">
                <div>
                    <label for="amount">生成数</label>
                    <input bind:value={amount} onchange={gen} min={1} max={50} type="number" id="amount" />
                </div>
                <div>
                    <label for="max">最大</label>
                    <input bind:value={max} onchange={gen} {min} type="number" id="max" />
                </div>
                <div>
                    <label for="min">最小</label>
                    <input bind:value={min} onchange={gen} {max} type="number" id="min" />
                </div>
                <div>
                    <button class="regen" onclick={gen}>再生成</button>
                </div>
            </div>
            <hr />
            {#each randoms as random, i}
                <div class="item">
                    <input type="number" class="out" readonly bind:value={randoms[i]} />
                    <button onclick={(_) => copy(random)}>コピー</button>
                </div>
            {/each}
        </div>
    </div>
</Container>

<style>
    .regen {
        width: 100%;
    }
    .controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        flex-wrap: wrap;
        align-items: center;
    }
    .controls > div {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .out {
        width: 100%;
    }
    input {
        flex: 1;
        padding: 5px;
        background-color: #222;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        font-size: 14px;
    }
    button {
        padding: 5px;
        background-color: #222;
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
