<script lang="ts">
    import Container from "$components/Container.svelte";
    import moment from "moment";
    import { onMount } from "svelte";

    let texts: string[] = [""]
    let totalTimes: number = 0
    let totalTimesFormatted = ""

    function toNumber(i: string): number {
        if (!Number.isNaN(i)) {
            return Number.parseFloat(i)
        }
        return 0
    }

    function parse(i: string): number {
        if (i == "") {
            return 0
        }

        if (i.split(":").length == 2) {
            i = "00:" + i
        }

        const ti = moment.duration(i, "seconds")
        if (ti.isValid()) {
            return ti.asSeconds()
        }
        return NaN
    }


    function sum(times: number[]): number {
        let ret = 0
        for (let time of times) {
            ret += time
        }

        return ret
    }

    function format(sec: number): string {
        let ret = ""

        ret += `${Math.floor(sec/3600)}`.padStart(2, "0")
        ret += ":"
        ret += `${Math.floor(sec%3600/60)}`.padStart(2, "0")
        ret += ":"
        ret += `${Math.floor(sec%3600%60)}`.padStart(2, "0")
        ret += `${decimalPart(sec%3600%60, 2).slice(1)}`


        return ret
    }

    function decimalPart(num: number, decDigits: number): string {
        const decPart = num - ((num >= 0) ? Math.floor(num) : Math.ceil(num));
        return decPart.toFixed(decDigits);
    }

    function avg(times: number[]): number {
        const elmCount = texts.filter(v => v != "").length
        if (elmCount == 0) {
            return 0
        }
        return sum(times) / elmCount
    }

    function clear() {
        if (confirm("ローカルストレージに保存されたデータを削除し、入力値をクリアします。よろしいですか?")) {
            localStorage.removeItem("timeavg_times")
            texts = [""]
            update()
        }
    }

    function update() {
        totalTimes = avg(texts.map(parse))
        texts = texts.filter((v, i) => !(i != 0 && v == ""))
        if (texts[texts.length-1] != "") {
            texts.push("")
        }
        totalTimesFormatted = format(totalTimes)

        localStorage.setItem("timeavg_times", JSON.stringify(texts))
    }

    onMount(() => {
        const storage = localStorage.getItem("timeavg_times")
        if (storage) {
            texts = JSON.parse(storage)
        }
    })
    totalTimesFormatted = format(0)
</script>
<Container>
    <h1>平均時間算出</h1>
    <hr />
    <div class="main">
        <div class="times">
            {#each texts as txt}
                <input type="text" bind:value={txt} placeholder="HH:mm:ss.nnn または 秒数" on:input={update}>
            {/each}
        </div>
        <div>
            <button on:click={update}>計算</button>
            <button on:click={clear}>ストレージクリア</button>
            {#if Number.isNaN(totalTimes)}
                <div class="totals">
                    <span class="desc">合計</span><br />
                    <span>入力エラー</span>
                </div>
            {:else}
                <div class="totals">
                    <span class="desc">合計</span><br />
                    <span>{totalTimes} Seconds</span><br />
                    <span>{totalTimesFormatted}</span>
                </div>
            {/if}
        </div>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    input {
        padding: 5px;
        background-color: #222;
        resize: none;
        border-radius: 5px;
        color: #fff;
        height: 14px;
        border: #666 1px solid;
    }
    .times {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    input:focus {
        outline: none;
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
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    .totals {
        border: 1px #666 solid;
        border-radius: 5px;
        padding: 10px;
        margin: 10px 0;
    }
    .totals > span:not(.desc) {
        margin: 20px;
    }
</style>