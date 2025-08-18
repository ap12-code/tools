<script lang="ts">
    import 'katex/dist/katex.css';
    import { onMount } from 'svelte';
    import nerdamer from 'nerdamer-prime';
    import 'nerdamer-prime/all';
    import { range } from '$lib/utils';
    import Text from '$components/form/Text.svelte';
    import { ActionResult } from '$lib/action_result';

    let expr = $state('y=2x');

    const zoom_unit = 0.5;
    const size = 1000;
    let zoom = $state(1);

    type Point = {
        x: number;
        y: number;
        rx: number;
        ry: number;
        hover: boolean;
    };

    let text_offset = [3, -3];

    let grid_size = $state(100);
    let graph_size = $state(800);
    let small_grid_size = $state(10);

    let offset = $state(0);

    let point_data = $state('');
    let points: Point[] = $state([]);
    let grid_count = $state(0);

    let font_size = 14;
    let point_size = 3;
    let color = 'red';

    let legends: number[] = $state(range(50));

    function one<T>(obj: T[] | T): T {
        if (Array.isArray(obj)) {
            return obj[0];
        }
        return obj;
    }

    function fix(num: number, dig: number): number {
        return Math.round(num * dig) / dig;
    }

    function renderChart() {
        if (!expr) return;
        if (zoom <= 0) zoom = 1;

        // zoom
        grid_count = graph_size / small_grid_size / zoom;
        graph_size = zoom * size;
        grid_size = graph_size / 10;
        small_grid_size = grid_size / 10;
        offset = (size - graph_size) / 2;

        point_data = '';
        points = [];
        let lines: string[] = [];

        const solver = one(nerdamer(expr));
        const solver_y = one(solver.solveFor('y')).evaluate();

        const max = Math.ceil(graph_size / small_grid_size / zoom / 2 / 10);

        for (let x = -max; x <= max; x += 0.1) {
            x = fix(x, 100);
            const y = solver_y.buildFunction(['x'])(x);

            const rx = fix(x * zoom * 100 + 500, 100);
            const ry = fix(-y * zoom * 100 + 500, 100);

            if (lines.length == 0) {
                lines.push(`M ${rx} ${ry}`);
            } else {
                lines.push(`L ${rx} ${ry}`);
            }

            if (x == 0 && y == 0) {
                points.push({
                    x: x,
                    y: -y,
                    hover: false,
                    rx: rx,
                    ry: ry
                });
                continue;
            }

            if (x % 0.5 == 0 && y % 0.5 == 0) {
                points.push({
                    x: x,
                    y: y,
                    hover: false,
                    rx: rx,
                    ry: ry
                });
            }
        }
        points = points;
        point_data = lines.join(' ');
    }
    function update() {
        renderChart();
    }

    function hover(val: Point, state: boolean) {
        const index = points.indexOf(val);
        points[index].hover = state;
        points = points;
    }

    function init() {
        update();
        const element = document.getElementById('graph');
        if (element instanceof SVGElement) {
            element.addEventListener('wheel', (ev) => {
                if (ev.deltaY < 0) {
                    if (zoom < 5) {
                        zoom += 0.1;
                    }
                } else {
                    if (zoom >= 0.5) {
                        zoom -= 0.1;
                    }
                }
                zoom = fix(zoom, 10);
                update();
            });
        }
    }

    onMount(init);
</script>

<div class="container">
    <div class="graph">
        <svg width="100%" id="graph" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="smallGrid" width={small_grid_size} height={small_grid_size} patternUnits="userSpaceOnUse">
                    <path d={`M ${small_grid_size} 0 L 0 0 0 ${small_grid_size}`} fill="none" stroke="gray" stroke-width="0.5" />
                </pattern>
                <pattern id="grid" width={grid_size} x={offset} y={offset} height={grid_size} patternUnits="userSpaceOnUse">
                    <rect width={grid_size} height={grid_size} fill="url(#smallGrid)" />
                    <path d={`M ${grid_size} 0 L 0 0 0 ${grid_size}`} fill="none" stroke="gray" stroke-width="1" />
                </pattern>
                <pattern id="centerLine" width={1000} height={1000} patternUnits="userSpaceOnUse">
                    <path d={`M 500 0 L 500 0 500 1000`} fill="none" stroke="white" stroke-width="0.5" />
                    <path d={`M 0 500 L 0 500 1000 500`} fill="none" stroke="white" stroke-width="0.5" />
                </pattern>
                <filter x="-0.1" y="-0.1" width="1.2" height="1.2" id="solid">
                    <feFlood flood-color="#ffffff" />
                    <feComposite in2="SourceGraphic" operator="xor" />
                </filter>
            </defs>

            <rect width={1000} height={1000} fill="url(#grid)" />
            <rect width={1000} height={1000} fill="url(#centerLine)" />
            <text x={size - text_offset[0] - font_size / 2} y={size / 2 + text_offset[1]} fill="white" font-size={font_size}>x</text>
            <text x={size / 2 + text_offset[0]} y={text_offset[1] + font_size} fill="white" font-size={font_size}>y</text>
            <text x={size / 2 + text_offset[0]} y={size / 2 + text_offset[1]} fill="white">0</text>

            <path width={1000} height={1000} scale={zoom} stroke={color} fill="none" stroke-width="1" d={point_data} />

            {#key points}
                {#each points as pt}
                    <circle
                        class="point"
                        role="tooltip"
                        onmouseenter={() => hover(pt, true)}
                        onmouseleave={() => hover(pt, false)}
                        fill={color}
                        cx={pt.rx}
                        cy={pt.ry}
                        r={point_size}
                    />
                {/each}
                {#each points as pt}
                    {#if pt.hover}
                        <text filter="url(#solid)" x={pt.rx + font_size / 2 + text_offset[0]} y={pt.ry + font_size / 2 + text_offset[1]}
                            >({pt.x}, {pt.y})</text
                        >
                    {/if}
                {/each}
            {/key}

            <rect width={1000} height={1000} fill="none" stroke="gray" stroke-width="0.5" />
        </svg>
    </div>
    <div class="control">
        <span>DEBUG / Zoom: {zoom} / Graph: {graph_size} / SGrid: {small_grid_size} / Grid: {grid_size} / Offset: {offset}</span>
        <Text bind:value={expr} oninput={update} validator={(v: string) => ActionResult.success(v)}></Text>
    </div>
</div>

<style>
    .container,
    .graph {
        display: block;
        height: 90%;
    }

    .control {
        margin: 10px 100px;
    }

    .point:hover {
        cursor: pointer;
        padding: 10px;
    }
</style>
