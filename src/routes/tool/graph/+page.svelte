<script lang="ts">
    import Container from "$components/Container.svelte";
    import nerdamer from "nerdamer";
    import katex from "katex";
    import "katex/dist/katex.css";
    import Button from "$components/Button.svelte";

    import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
    import { onMount } from "svelte";

    let chartData = {
        labels: [],
        datasets: [
            {
                label: "Sample",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [],
            },
        ],
    };
    Chart.register(
        LineController,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
        Tooltip, // ツールチップ表示用,お好みで
        Legend, // 凡例表示用,お好みで
    );

    let chartCanvas: HTMLCanvasElement;
    function renderChart() {
        let chart = new Chart(chartCanvas, {
            type: "line",
            data: chartData,
            options: {},
        });
    }
    onMount(renderChart);
</script>

<Container>
    <h1>数式計算機</h1>
    <hr />
    <div class="main">
        <span id="math"></span>
        <canvas bind:this={chartCanvas}></canvas>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
