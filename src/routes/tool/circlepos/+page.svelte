<script lang="ts">
    import Container from '$components/Container.svelte';
    import Number from '$components/form/Number.svelte';
    import Range from '$components/form/Range.svelte';

    let radius = $state(50);
    let cx = $state(50);
    let cy = $state(50);
    let height = $state(100);
    let width = $state(100);
</script>

<Container>
    <h1>円周上の座標</h1>
    <hr />
    <Number label="半径" bind:value={radius} />
    <hr />
    <Number label="中心X" bind:value={cx} />
    <Number label="中心Y" bind:value={cy} />
    <hr />
    <Number label="高さ" bind:value={height} />
    <Number label="幅" bind:value={width} />
    <hr />
    <Range></Range>
    <svg {height} {width} fill="#ffffff">
        <circle {cx} {cy} r={radius - 1} stroke="#f00" stroke-width="2"></circle>
    </svg>
</Container>

<style>
    svg {
        background-color: #000;
        padding: 20px;
    }
</style>
