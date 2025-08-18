<script lang="ts">
    import Container from '$components/Container.svelte';
    import { Decimal } from 'decimal.js';
    import type { PageServerData } from './$types';
    import moment from 'moment';
    import { onMount } from 'svelte';

    interface Props {
        data: Record<string, number>;
    }

    let { data = $bindable() }: Props = $props();
    let errs: Record<string, boolean> = $state({});
    let vaules: Record<string, string> = $state({
        JPY: '0',
        USD: '0',
        EUR: '0',
        GBP: '0',
        AUD: '0',
        NZD: '0',
        CAD: '0',
        CHF: '0',
        TRY: '0',
        ZAR: '0',
        MXN: '0'
    });

    async function load() {
        const resp = await fetch(`https://exchange-rate-api.krnk.org/api/rate`);
        data = await resp.json();
    }

    function change(unit: string, re?: boolean) {
        if (vaules[unit].endsWith('.')) return;
        errs[unit] = false;
        if (!errs[unit]) {
            if (!vaules[unit]) vaules[unit] = '0';
            if (isNaN(parseFloat(vaules[unit]))) return (errs[unit] = true);
            vaules[unit] = parseFloat(vaules[unit]).toString();
            console.log(vaules);
            for (let v of Object.keys(vaules)) {
                if (v == unit) continue;
                if (unit == 'JPY') {
                    const c = new Decimal(vaules[unit]).div(data[`${v}_JPY`]);
                    vaules[v] = c.toString();
                } else {
                    const c = new Decimal(vaules[unit]).mul(data[`${unit}_JPY`]);
                    vaules['JPY'] = c.toString();
                    change('JPY');
                }
            }
        }
    }

    onMount(load);
</script>

<Container back_to={'/tool/converters'}>
    <h1>通貨換算</h1>
    <hr />
    <div class="main">
        {#each Object.keys(vaules) as k}
            <div>
                <input class:err={errs[k]} bind:value={vaules[k]} oninput={(_) => change(k)} />
                <span>{k}</span>
            </div>
        {/each}
    </div>
    <p>為替データ取得日時: {moment(data.datetime).format('YYYY/MM/DD HH:mm:ss')}</p>
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
        width: 50px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
