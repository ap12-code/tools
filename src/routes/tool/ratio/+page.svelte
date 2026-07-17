<script lang="ts">
    import Button from '$components/Button.svelte';
    import Container from '$components/Container.svelte';
    import { range } from '$lib/utils';
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';

    let base_numbers: number[] = $state([1, 2]);
    let amount = $derived(base_numbers.length);
    let rows: number[][] = $state([[], []]);
    const gcd1 = (a: number, b: number): number => (b === 0 ? a : gcd1(b, a % b));
    const gcd = (arr: number[]): number => arr.reduce((a, b) => gcd1(a, b));
    const decimalPlaces = (a: number) => (a.toString().includes('.') ? a.toString().split('.', 2)[1].length : 0);

    function add() {
        base_numbers.push(1);
        for (let j = 0; j < rows.length; j++) {
            updateRow(j, 0, 1);
        }
    }

    function remove(i: number) {
        base_numbers.splice(i, 1);
    }

    function update(r: number) {
        for (let j = 1; j < amount; j++) {
            rows[0][j] = (base_numbers[j] / base_numbers[0]) * rows[0][0];
        }
        const precision = 10 ^ Math.max(...base_numbers.map(decimalPlaces));
        if (precision == 0) {
            rows[1] = Array.from(rows[0]);
        } else {
            const enlarged = base_numbers.map((p) => p * precision);
            const common = gcd(enlarged);
            for (let j = 0; j < amount; j++) {
                rows[1] = enlarged.map((p) => p / common);
            }
        }
    }

    function updateBase(i: number, v: number) {
        base_numbers[i] = v;
        update(0);
    }
    function updateRow(r: number, i: number, v: number) {
        rows[r][i] = v;
        update(r);
    }
    onMount(() => {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < amount; j++) {
                rows[i][j] = 0;
            }
            updateRow(i, 0, 1);
        }
    });
</script>

<Container>
    <h1>比率計算</h1>
    <hr />
    <div class="main">
        <div class="row">
            <span class="desc">基準</span>
            {#each range(amount) as i}
                <input type="number" bind:value={() => base_numbers[i], (v) => updateBase(i, v)} />
                {#if amount - 1 != i}
                    <span class="colon">:</span>
                {/if}
            {/each}
        </div>
        <Icon icon="material-symbols:arrow-cool-down" width="18" height="18" />
        <div class="row">
            <span class="desc">x:...</span>
            {#each range(amount) as i}
                <input type="number" readonly={i != 0} bind:value={() => rows[0][i], (v) => updateRow(0, i, v)} />
                {#if amount - 1 != i}
                    <span class="colon">:</span>
                {/if}
            {/each}
        </div>
        <div class="row">
            <span class="desc">整数比</span>
            {#each range(amount) as i}
                <input type="number" readonly bind:value={() => rows[1][i], (v) => updateRow(1, i, v)} />
                {#if amount - 1 != i}
                    <span class="colon">:</span>
                {/if}
            {/each}
        </div>

        <br />
        {#if amount > 2}
            <div class="row row-buttons">
                <span class="desc">&nbsp;</span>
                {#each range(amount) as i}
                    <Button onclick={() => remove(i)}>
                        <Icon icon="material-symbols:delete-forever" inline /> 削除
                    </Button>
                    {#if amount - 1 != i}
                        <span class="colon">&nbsp;</span>
                    {/if}
                {/each}
            </div>
        {/if}
        <Button onclick={() => add()}>
            <Icon icon="material-symbols:add" inline /> 数値追加
        </Button>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    input {
        height: 30px;
        flex-grow: 1;
        background-color: #222;
        resize: none;
        align-content: center;
        border-radius: 5px;
        padding: 0 5px;
        font-size: 1em;
        color: #fff;
        border: 1px #666 solid;
    }
    input:focus {
        outline: none;
    }
    .row {
        display: flex;
        gap: 5px;
        align-items: center;
    }
    .row :global(input) {
        width: 100%;
    }
    .row .colon {
        text-align: center;
        font-size: 20px;
        width: 20px;
        line-height: 15px;
        height: 20px;
    }
    .row .desc {
        min-width: 60px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
