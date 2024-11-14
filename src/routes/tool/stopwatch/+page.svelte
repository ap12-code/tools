<script lang="ts">
    import Container from "$components/Container.svelte";
    import { onMount } from "svelte";
    type Stopwatch = {
        time: number;
        name: string;
        started: boolean;
        saved_at: Date;
    };

    let stopwatches: Stopwatch[] = [];

    function save() {
        for (let w of stopwatches) {
            w.saved_at = new Date();
        }
        localStorage.setItem("stopwatch", JSON.stringify(stopwatches));
    }
    function load() {
        const strCount = localStorage.getItem("stopwatch");
        if (!strCount) {
            save()
            return
        }
        stopwatches = JSON.parse(strCount);
        for (let w of stopwatches) {
            if (!w.started) continue;
            w.time += new Date().getTime() - new Date(w.saved_at).getTime();
        }

        setInterval(() => {
            stopwatches.forEach((_, i) => {
                if (stopwatches[i].started) stopwatches[i].time += 10;
                save();
            });
        }, 10);
    }
    function reset(id: number) {
        stopwatches[id].started = false;
        stopwatches[id].time = 0;
        save();
    }
    function start(id: number) {
        stopwatches[id].started = true;
        save();
    }
    function pause(id: number) {
        stopwatches[id].started = false;
        save();
    }
    const floor = Math.floor;
    const pad = (v: number, l: number) => v.toString().padStart(l, "0");
    function parse(val: number): string {
        return `${pad(floor(val / 1000 / 60 / 60), 2)}:${pad(floor((val / 1000 / 60) % 60), 2)}:${pad(floor(((val / 1000) % 60) % 60), 2)}.${pad(floor((val % 1000) / 10), 2)}`;
    }
    function create() {
        stopwatches.push({
            time: 0,
            name: "",
            started: false,
            saved_at: new Date(),
        });
        stopwatches = stopwatches;
        save();
    }
    function del(index: number) {
        stopwatches.splice(index, 1);
        stopwatches = stopwatches;
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
    <h1>ストップウォッチ</h1>
    <p>データはブラウザのストレージに保存してくれます。また、ブラウザを閉じても計測されます</p>
    <hr />
    <div class="counters">
        {#each stopwatches as stopwatch, index}
            <div class="counter border">
                <div class="title">
                    <input placeholder="タイトル" type="text" bind:value={stopwatch.name} on:input={save} />
                </div>
                <div class="cn">
                    <span class="count">{parse(stopwatch.time)}</span><br />
                </div>
                <div class="control">
                    {#if stopwatch.started}
                        <button on:click={(_) => pause(index)}>停止</button>
                    {:else}
                        <button on:click={(_) => start(index)}>開始</button>
                    {/if}
                    <button on:click={(_) => reset(index)}>リセット</button>
                    <button on:click={(_) => del(index)}>削除</button>
                </div>
            </div>
        {/each}
        <div class="counter">
            <div>
                <button on:click={create}><i class="bi bi-plus-lg" /> 作成</button>
            </div>
        </div>
    </div>
</Container>

<style>
    .counters {
        display: grid;
        justify-content: center;
        gap: 30px;
    }
    .counter.border {
        border: #666 1px solid;
        border-radius: 5px;
    }
    .counter {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .control {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(3, 1fr);
        text-align: center;
    }
    .title {
        text-align: center;
    }
    .title > input {
        text-align: center;
    }
    .count {
        font-size: max(5vw, 60px);
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
