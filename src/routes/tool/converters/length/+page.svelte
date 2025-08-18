<script lang="ts">
    import Container from '$components/Container.svelte';
    import { Decimal } from 'decimal.js';
    import _ from 'lodash';

    let mapping: Record<string, Decimal> = {
        nm: new Decimal(1),
        um: new Decimal(1000),
        mm: new Decimal(1000 * 1000),
        cm: new Decimal(1000 * 1000 * 10),
        m: new Decimal(1000 * 1000 * 10 * 100),
        in: new Decimal(1000 * 1000 * 10 * 2.54),
        ft: new Decimal(1000 * 1000 * 10 * 2.54 * 12),
        mi: new Decimal((1000 * 1000 * 10 * 100) / 0.000621371),
        yd: new Decimal(1000 * 1000 * 10 * 100 * 1.0936132983),
        km: new Decimal(1000 * 1000 * 10 * 100 * 1000)
    };

    let values: Record<string, string> = $state({
        nm: '0',
        um: '0',
        mm: '0',
        cm: '0',
        m: '0',
        km: '0',
        in: '0',
        ft: '0',
        yd: '0',
        mi: '0'
    });
    let errs: Record<string, boolean> = $state({});

    function change(unit: string) {
        if (values[unit].endsWith('.')) return;
        if (values[unit].endsWith('-')) {
            if (values[unit].startsWith('-')) {
                values[unit] = `${values[unit].slice(1, -1)}`;
            } else {
                values[unit] = `-${values[unit].slice(0, -1)}`;
            }
            if (values[unit] == '0' || values[unit] == '-0') return;
        }
        errs[unit] = false;
        if (!errs[unit]) {
            if (!values[unit]) values[unit] = '0';
            if (isNaN(parseFloat(values[unit]))) return (errs[unit] = true);
            values[unit] = parseFloat(values[unit]).toString();
            for (let v of Object.keys(values)) {
                if (v == unit) continue;
                const c = new Decimal(mapping[v]).div(new Decimal(mapping[unit]));
                values[v] = new Decimal(values[unit]).div(c).toString();
            }
        }
    }
</script>

<Container back_to={'/tool/converters'}>
    <h1>距離換算</h1>
    <hr />
    <div class="main">
        {#each Object.keys(values) as k}
            <div>
                <input class:err={errs[k]} bind:value={values[k]} oninput={(_) => change(k)} />
                <span>{k}</span>
            </div>
        {/each}
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .main > div {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .err {
        border-color: #d00;
    }
    input {
        flex: 1;
        padding: 5px;
        background-color: #222;
        resize: none;
        border-radius: 5px;
        color: #fff;
        height: 14px;
        border: #666 1px solid;
    }
    input:focus {
        outline: none;
    }
    span {
        text-align: start;
        width: 150px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
