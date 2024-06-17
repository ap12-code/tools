<script lang="ts">
    import Container from "$components/Container.svelte";
    import { onMount } from "svelte";

    async function fetchTime(): Promise<Date> {
        const fetched = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo");
        const json = await fetched.json();
        return new Date(json.datetime);
    }

    let d: Date | null = null;

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

    function getTimeStr(val: Date): string {
        return `${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(val.getSeconds())}`;
    }

    function getDateStr(val: Date) {
        return `${pad(val.getFullYear())}/${pad(val.getMonth() + 1)}/${pad(val.getDate())} (${day(val.getDay())})`;
    }

    onMount(async () => {
        d = await fetchTime();
        setInterval(() => {
            if (!d) return;
            d.setSeconds(d.getSeconds() + 1);
            d = d;
        }, 1000);
        setInterval(async () => {
            d = await fetchTime();
        }, 10000);
    });
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<Container>
    <h1>時計</h1>
    <hr />
    <div class="clock">
        {#if d}
            <span class="time">{getTimeStr(d)}</span><br />
            <span class="date">{getDateStr(d)}</span>
        {:else}
            <span>時刻取得中...</span>
        {/if}
    </div>
    <p></p>
</Container>

<style>
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
</style>
