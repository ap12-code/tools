<script lang="ts">
    import Container from "$components/Container.svelte";
    import { onMount } from "svelte";
    let d = new Date()
    onMount(() => {
        setInterval(() => {
            d = new Date()
        }, 500)
    })

    function day(day: number) {
        switch (day) {
            case 0:
                return "日"
            case 1:
                return "月"
            case 2:
                return "火"
            case 3:
                return "水"
            case 4:
                return "木"
            case 5:
                return "金"
            case 6:
                return "土"
        }
    }
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
</svelte:head>


<Container>
    <h1>時計</h1>
    <hr />
    <div class="clock">
        <span class="time">{d.toLocaleTimeString()}</span><br />
        <span class="date">{d.toLocaleDateString()} ({day(d.getDay())})</span>
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