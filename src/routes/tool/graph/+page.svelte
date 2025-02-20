<script lang="ts">
    import Container from "$components/Container.svelte";
    import nerdamer from "nerdamer-prime";
    import "nerdamer-prime/all";
    import katex from "katex";
    import "katex/dist/katex.css";
    import Button from "$components/Button.svelte";
    import { onMount } from "svelte";

    let raw_expr = $state("y=x");
    let expr = nerdamer("y=x");
    let size = 500;
    let sc = $state(10);
    let center = size / 2;

    let chartCanvas: HTMLCanvasElement | undefined = $state();
    function renderGrid() {
        if (!chartCanvas) return;

        chartCanvas.style.width = `${size}px`;
        chartCanvas.style.height = `${size}px`;

        const scale = window.devicePixelRatio;
        chartCanvas.width = Math.floor(size * scale);
        chartCanvas.height = Math.floor(size * scale);

        const ctx = chartCanvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(scale, scale);
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        for (let x = 0; x <= size; x += sc) {
            ctx.strokeStyle = x == center ? "#bbb" : "#666";
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, size);
            ctx.stroke();
            ctx.closePath();
        }
        for (let y = 0; y <= size; y += sc) {
            ctx.strokeStyle = y == center ? "#bbb" : "#666";
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(size, y);
            ctx.stroke();
            ctx.closePath();
        }
    }

    function renderChart() {
        if (!chartCanvas) return;

        const ctx = chartCanvas.getContext("2d");
        if (!ctx) return;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(center, center);
        for (let x = -center; x < center; x++) {
            let solver = expr.solveFor("y");
            if (solver instanceof Array) {
                solver = solver[0];
            }
            const y = solver.evaluate().buildFunction(["x"])(x);
            ctx.lineTo(center + x * sc, center - y * sc);
        }
        ctx.stroke();
        ctx.closePath();
    }
    function update() {
        if (!chartCanvas) return;

        const ctx = chartCanvas.getContext("2d");
        if (!ctx) return;
        expr = nerdamer(raw_expr);
        ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        renderGrid();
        renderChart();
    }
    onMount(update);
</script>

<Container>
    <h1>グラフ描画</h1>
    <hr />
    <div class="main">
        <span id="math"></span>
        <canvas width={1000} height={1000} bind:this={chartCanvas}></canvas>
    </div>
    <div>
        <button
            onclick={(_) => {
                sc += 10;
                update();
            }}>+</button
        >
        <button
            onclick={(_) => {
                sc -= 10;
                update();
            }}>-</button
        >
        <textarea bind:value={raw_expr} oninput={update}></textarea>
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
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
        height: 20vh;
        margin: 10px 0;
    }
</style>
