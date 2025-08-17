<script lang="ts">
    import Container from "$components/Container.svelte";
    import { DateTime, Duration } from "luxon";
    import { browser } from "$app/environment";
    import { SvelteDate } from "svelte/reactivity";

    let latency = $state(Duration.fromMillis(0));
    let offset = $state(Duration.fromMillis(0));
    let last_sync: DateTime | null = $state(null);
    let last_sync_sec = $state(0);
    let tz = $state("Asia/Tokyo");
    let tzs: string[] = $state([]);

    let fixedTime: DateTime | null = $state(null);
    let dtime: number | null = $state(null);

    let timeStr: string = $state("");
    let dateStr: string = $state("");

    type TimeAPICurrentZone = {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        seconds: number;
        milliSeconds: number;
        dateTime: string;
        date: string;
        time: string;
        timeZone: string;
        dayOfWeek: string;
        dstActive: boolean;
    };

    async function fetchTime(): Promise<void> {
        if (last_sync && last_sync.diffNow().seconds < 60) {
            return;
        }
        const sendTime = DateTime.now();
        const fetched = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${tz}`);
        const json: TimeAPICurrentZone = await fetched.json();
        const endTime = DateTime.now();
        latency = endTime.diff(sendTime);
        fixedTime = DateTime.fromISO(json.dateTime).plus(latency);
        offset = DateTime.now().diff(fixedTime);
        last_sync = fixedTime;
        console.log("[FETCH] Time: OK");
        console.log(fixedTime.toFormat("yyyy/MM/dd HH:mm:ss"));
    }

    function day(day: number) {
        switch (day) {
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
            case 7:
                return "日";
        }
    }

    function pad(val: number): string {
        return val.toString().padStart(2, "0");
    }

    function getTimeStr(val: DateTime): string {
        return val.toFormat("HH:mm:ss");
    }

    function getDateStr(val: DateTime) {
        return `${val.toFormat("yyyy/MM/dd")} (${day(val.weekday)})`;
    }

    function updateStrings() {
        if (!fixedTime) return;
        timeStr = getTimeStr(fixedTime);
        dateStr = getDateStr(fixedTime);
    }

    async function load() {
        tzs = await (await fetch("https://timeapi.io/api/timezone/availabletimezones")).json();
        console.log("[FETCH] TimeZone: OK");
        await fetchTime();

        setInterval(() => {
            if (!fixedTime) return;
            if (!last_sync) return;
            fixedTime = fixedTime.plus(Duration.fromMillis(1000));
            updateStrings();
            last_sync_sec = fixedTime.diff(last_sync).milliseconds;
        }, 1000);
        setInterval(async () => {
            fixedTime = null;
            await fetchTime();
        }, 64000);
    }

    async function updateTZ() {
        await fetchTime();
    }

    if (browser) load();
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
        {#if fixedTime}
            <span class="time">{timeStr}</span><br />
            <span class="date">{dateStr}</span><br />
            <div class="space"></div>
            <select bind:value={tz} onchange={updateTZ}>
                {#each tzs as tze}
                    <option value={tze}>{tze.replace("Etc/", "")}</option>
                {/each}
            </select>
            {#if last_sync}
                <span class="debug">
                    最終同期: {last_sync.toFormat("yyyy/MM/dd HH:mm:ss")} ({Math.floor(last_sync_sec / 1000)}秒前)
                </span>
                <span>所要取得時間: {latency.milliseconds}ms / クライアントとの差: {offset.milliseconds}ms</span><br />
                <span>サーバー: <a href="https://timeapi.io">timeapi.io</a></span>
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
    a {
        color: #fff;
    }
</style>
