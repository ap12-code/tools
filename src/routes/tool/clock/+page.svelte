<script lang="ts">
    import Container from "$components/Container.svelte";
    import { onMount } from "svelte";
    import moment, { type Moment } from "moment-timezone";

    let latency = $state(-1);
    let offset = $state(0);
    let last_sync: Moment | null = $state(null);
    let last_sync_sec = $state(0);
    let tz = $state("Asia/Tokyo");
    let tzs: string[] = $state([]);

    let d: Moment | null = $state(null);
    let dtime: number | null = $state(null);

    async function fetchTime(): Promise<void> {
        d = null;
        const sendTime = moment();
        const fetched = await fetch(`https://worldtimeapi.org/api/timezone/${tz}`);
        const json = await fetched.json();
        const endTime = moment();
        latency = endTime.diff(sendTime);
        let fixedTime = Math.floor(json.unixtime * 1000 + latency / 2);
        dtime = fixedTime;
        d = moment.tz(dtime, tz);
        offset = moment.now() - fixedTime;
        last_sync = moment(fixedTime);
    }

    function day(day: number) {
        switch (day) {
            case 0:
                return "日";
            case 1:
                return "月";
            case 2:
                return "火";
            case 3:
                return "水";
            case 4:
                return "木";
            case 5:
                return "金";
            case 6:
                return "土";
        }
    }

    function pad(val: number): string {
        return val.toString().padStart(2, "0");
    }

    function getTimeStr(val: Moment): string {
        return val.format("HH:mm:ss");
    }

    function getDateStr(val: Moment) {
        return `${val.format("YYYY/MM/DD")} (${day(val.day())})`;
    }

    onMount(async () => {
        moment.locale("ja");
        tzs = await (await fetch("https://worldtimeapi.org/api/timezone")).json();
        await fetchTime();

        setInterval(() => {
            if (!d || !dtime) return;
            dtime += 1000;
            d = moment.tz(dtime, tz);
            last_sync_sec = d.diff(last_sync);
        }, 1000);
        setInterval(async () => {
            dtime = 0;
            d = null;
            await fetchTime();
        }, 64000);
    });

    async function updateTZ() {
        await fetchTime();
    }
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
</svelte:head>

<Container>
    <h1>時計</h1>
    <hr />
    <div class="clock">
        {#if d && dtime}
            <span class="time">{getTimeStr(d)}</span><br />
            <span class="date">{getDateStr(d)}</span><br />
            <div class="space"></div>
            <select bind:value={tz} onchange={updateTZ}>
                {#each tzs as tze}
                    <option value={tze}>{tze.replace("Etc/", "")}</option>
                {/each}
            </select>
            {#if last_sync}
                <span class="debug">
                    最終同期: {last_sync.format("YYYY/MM/DD HH:mm:ss")} ({Math.floor(last_sync_sec / 1000)}秒前)
                </span>
                <span>取得時間: {latency}ms / クライアントずれ: {offset}ms</span><br />
                <span>サーバー: https://worldtimeapi.org</span>
            {/if}
        {:else}
            <span>時刻取得中...</span>
        {/if}
    </div>
    <p></p>
</Container>

<style>
    .space {
        margin: 40px 0;
    }
    .time {
        font-size: 100px;
        text-align: center;
        font-family: "Share Tech Mono", monospace;
    }
    .date {
        font-size: 40px;
        text-align: center;
        font-family: "Share Tech Mono", monospace;
    }
    .clock {
        text-align: center;
    }

    .debug {
        margin-top: 100px;
        display: block;
    }
    select {
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        outline: none;
        width: 300px;
    }
</style>
