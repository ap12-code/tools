<script lang="ts">
    import Container from "$components/Container.svelte";
    import { onMount } from "svelte";
    type Counter = {
        count: number;
        name: string;
    };

    let counters: Counter[] = [];

    function save() {
        localStorage.setItem("counter", JSON.stringify(counters));
    }
    function load() {
        const strCount = localStorage.getItem("counter");
        if (!strCount) return;
        counters = JSON.parse(strCount);
    }
    function add(id: number, num: number) {
        counters[id].count += num;
        save();
    }
    function set(id: number, num: number) {
        counters[id].count = num;
        save();
    }
    function add_counter() {
        counters.push({
            count: 0,
            name: "",
        });
        counters = counters;
        save();
    }
    function del_counter(index: number) {
        counters.splice(index, 1);
        counters = counters;
        save();
    }
    onMount(load);
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
</svelte:head>

<Container>
    <h1>カウンタ</h1>
    <p>数値はブラウザのストレージに保存してくれます</p>
    <hr />
    <div class="counters">
        {#each counters as counter, index}
            <div class="counter">
                <div class="title">
                    <input placeholder="タイトル" type="text" bind:value={counter.name} on:input={save} />
                </div>
                <div class="cn">
                    <span class="count">{counter.count}</span><br />
                </div>
                <div class="control">
                    <button on:click={(_) => add(index, 1)}>+1</button>
                    <button on:click={(_) => add(index, -1)}>-1</button>
                </div>
                <div class="control">
                    <button on:click={(_) => add(index, 10)}>+10</button>
                    <button on:click={(_) => add(index, -10)}>-10</button>
                </div>
                <div class="control">
                    <button on:click={(_) => add(index, 100)}>+100</button>
                    <button on:click={(_) => add(index, -100)}>-100</button>
                </div>
                <div class="control">
                    <button on:click={(_) => set(index, 0)}>0</button>
                    <button on:click={(_) => del_counter(index)}>削除</button>
                </div>
            </div>
        {/each}
        <div class="counter">
            <div>
                <button on:click={add_counter}><i class="bi bi-plus-lg" /> 作成</button>
            </div>
        </div>
    </div>
</Container>

<style>
    .counters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 300px));
        align-items: center;
    }
    .counter {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        align-items: center;
        height: 45vh;
        width: 300px;
    }
    .control {
        text-align: center;
    }
    .title {
        text-align: center;
    }
    .title > input {
        text-align: center;
    }
    .count {
        font-size: 100px;
        text-align: center;
        font-family: "Share Tech Mono", monospace;
    }
    .cn {
        text-align: center;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 100px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 32px;
        transition: 0.2s all;
    }
    button:hover {
        background-color: #666;
        transition: 0.2s all;
        cursor: pointer;
    }
    input {
        background-color: #222;
        padding: 5px;
        border: none;
        border-radius: 5px;
        color: #fff;
        height: 24px;
    }
</style>
