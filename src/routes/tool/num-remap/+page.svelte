<script lang="ts">
    import Container from '$components/Container.svelte';
    import Number from '$components/form/Number.svelte';

    let inrange_max = $state(0);
    let inrange_min = $state(0);

    let outrange_max = $state(0);
    let outrange_min = $state(0);

    let input = $state(0);
    let output = $state(0);

    function updateInput() {
        output = outrange_min + ((input - inrange_min) / (inrange_max - inrange_min)) * (outrange_max - outrange_min);
    }
</script>

<Container>
    <h1>数値範囲変換</h1>
    <hr />
    <p>入力範囲</p>
    <div class="inputs">
        <Number label="最大値" bind:value={inrange_max} oninput={updateInput} />
        <Number label="最小値" bind:value={inrange_min} oninput={updateInput} />
    </div>
    <hr />
    <p>出力範囲</p>
    <div class="inputs">
        <Number label="最大値" bind:value={outrange_max} oninput={updateInput} />
        <Number label="最小値" bind:value={outrange_min} oninput={updateInput} />
    </div>
    <hr />
    <p>計算</p>
    <div class="inputs">
        <Number label="入力" bind:value={input} oninput={updateInput} />
        <Number label="出力" bind:value={output} />
    </div>
</Container>

<style>
    .inputs {
        margin-bottom: 30px;
        padding: 0 20px;
    }
</style>
