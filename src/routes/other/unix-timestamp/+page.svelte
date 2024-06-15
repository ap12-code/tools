<script lang="ts">
    import Container from "$components/Container.svelte";
    import { browser } from "$app/environment"
    import { onMount } from "svelte"

    let inputs: Record<string, string> = {
        year: "2023",
        month: "12",
        day: "31",
        hour: "23",
        minute: "59",
        second: "59",
        ms: "000"
    }
    let tz = 0
    let outputs = {
        time: "",
        plain: "",
        timems: ""
    }

    const ORDERS = ["year", "month", "day", "hour", "minute", "second"]

    function next() {
        const selectionNode = document.activeElement
        if (!selectionNode) return
        if (!(selectionNode instanceof Element)) return
        const nowId = selectionNode.id
        const nowIndex = ORDERS.findIndex(p => p == nowId)
        if (nowIndex == -1) return
        let nextId = ""
        if (nowIndex + 1 >= ORDERS.length) {
            nextId = ORDERS[0]
        } else {
            nextId = ORDERS[nowIndex + 1]
        }
        if (!nextId) return
        document.getElementById(nextId)?.focus()
    }

    function prev() {
        const selectionNode = document.activeElement
        if (!selectionNode) return
        if (!(selectionNode instanceof Element)) return
        const nowId = selectionNode.id
        const nowIndex = ORDERS.findIndex(p => p == nowId)
        if (nowIndex == -1) return
        let prevId = ""
        if (nowIndex - 1 < 0) {
            prevId = ORDERS[0]
        } else {
            prevId = ORDERS[nowIndex - 1]
        }
        if (!prevId) return
        document.getElementById(prevId)?.focus()

    }

    function formatValue(v: string, c: number, min: number, max: number): string {
        if (parseInt(v).toString().length > c) v = v.substring(c)
        v = Math.min(parseInt(v), max).toString()
        v = Math.max(parseInt(v), min).toString()
        v = parseInt(v).toString().padStart(c, "0")
        return v
    }

    function update() {
        if (!browser) return
        inputs.year = formatValue(inputs.year, 4, 0, 9999)
        inputs.month = formatValue(inputs.month, 2, 1, 12)
        inputs.day = formatValue(inputs.day, 2, 1, 31)
        inputs.hour = formatValue(inputs.hour, 2, 0, 23)
        inputs.minute = formatValue(inputs.minute, 2, 0, 59)
        inputs.second = formatValue(inputs.second, 2, 0, 59)

        const out = new Date(
            parseInt(inputs.year),
            parseInt(inputs.month) - 1,
            parseInt(inputs.day),
            parseInt(inputs.hour),
            parseInt(inputs.minute),
            parseInt(inputs.second),
            parseInt(inputs.ms)
        )
        outputs.time = Math.round(out.getTime() / 1000).toString()
        outputs.timems = Math.round(out.getTime()).toString()
        outputs.plain = out.toLocaleString()
    }

    function updateTS() {
        if (!browser) return
        const input = new Date(parseInt(outputs.time) * 1000)

        inputs.year = input.getFullYear().toString()
        inputs.month = (input.getMonth() + 1).toString()
        inputs.day = input.getDate().toString()
        inputs.hour = input.getHours().toString()
        inputs.minute = input.getMinutes().toString()
        inputs.second = input.getSeconds().toString()
        inputs.ms = input.getMilliseconds().toString()
        update()
    }

    function updateTSMS() {
        if (!browser) return
        const input = new Date(outputs.timems)

        inputs.year = input.getFullYear().toString()
        inputs.month = (input.getMonth() + 1).toString()
        inputs.day = input.getDate().toString()
        inputs.hour = input.getHours().toString()
        inputs.minute = input.getMinutes().toString()
        inputs.second = input.getSeconds().toString()
        inputs.ms = input.getMilliseconds().toString()
        update()
    }

    function add() {
        const selectionNode = document.activeElement
        if (!selectionNode) return
        if (!(selectionNode instanceof HTMLInputElement)) return
        selectionNode.value = (parseInt(selectionNode.value) + 1).toString()
        inputs[selectionNode.id] = selectionNode.value
        update()
    }

    function subtract() {
        const selectionNode = document.activeElement
        if (!selectionNode) return
        if (!(selectionNode instanceof HTMLInputElement)) return
        selectionNode.value = (parseInt(selectionNode.value) - 1).toString()
        inputs[selectionNode.id] = selectionNode.value
        update()
    }

    function key(ev: KeyboardEvent) {
        switch (ev.key) {
            case "ArrowRight":
                ev.preventDefault()
                next()
                break
            case "ArrowLeft":
                ev.preventDefault()
                prev()
                break
            case "ArrowUp":
                ev.preventDefault()
                add()
                break
            case "ArrowDown":
                ev.preventDefault()
                subtract()
                break
        }
    }
    onMount(() => {
        outputs.time = Math.floor(new Date().getTime() / 1000).toString()
        updateTS()
        update()
    })
    function copy() {}
</script>
<Container>
    <h1>UNIX TIMESTAMP 変換</h1>
    <hr />
    <p>時間</p>
    <div class="item">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="inputs" on:keydown={key}>
            <div>
                <input id="year" type="text" placeholder="年" bind:value={inputs.year} on:input={update}>年
            </div>
            <div>
                <input id="month" type="text" placeholder="月" bind:value={inputs.month} on:input={update}>月
            </div>
            <div>
                <input id="day" type="text" placeholder="日" bind:value={inputs.day} on:input={update}>日
            </div>
            <div>
                <input id="hour" type="text" placeholder="年" bind:value={inputs.hour} on:input={update}>時
            </div>
            <div>
                <input id="minute" type="text" placeholder="月" bind:value={inputs.minute} on:input={update}>分
            </div>
            <div>
                <input id="second" type="text" placeholder="日" bind:value={inputs.second} on:input={update}>秒
            </div>
        </div>
    </div>
    <div class="item">
        <textarea readonly bind:value={outputs.plain}></textarea>
        <button on:click={_ => copy()}>コピー</button>
    </div>
    <hr />
    <div>
        <p>UNIX TIMESTAMP</p>
        <span>秒単位 (Pythonなど)</span>
        <div class="item">
            <input class="out" type="number" bind:value={outputs.time} on:input={updateTS} />
            <button on:click={_ => copy()}>コピー</button>
        </div>
        <span>ミリ秒単位 (JavaScriptなど)</span>
        <div class="item">
            <input class="out" type="number" bind:value={outputs.timems} on:input={updateTSMS} />
            <button on:click={_ => copy()}>コピー</button>
        </div>
    </div>
</Container>

<style>
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
    }
    .item {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        height: 30px;
    }
    .item > div {
        flex: 1;
    }
    input {
        cursor: pointer;
        background-color: #222;
        padding: 5px;
        border: none;
        color: #fff;
        height: 18px;
        outline: none;
    }
    input:not(.out) {
        text-align: center;
        width: 35px;
    }
    input.out {
        width: 100%;
        border: #666 1px solid;
        border-radius: 5px;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 200px;
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
    .inputs {
        width: 100%;
        display: flex;
        gap: 10px;
        border: #666 1px solid;
        border-radius: 5px;
    }
</style>