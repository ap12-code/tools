<script lang="ts">
    import Container from "$components/Container.svelte";
    import { Decimal } from "decimal.js";

    let mapping: Record<string, Decimal> = {
        ng: new Decimal(1),
        ug: new Decimal(1).mul(1000),
        mg: new Decimal(1).mul(1000).mul(1000),
        g: new Decimal(1).mul(1000).mul(1000).mul(1000),
        kg: new Decimal(1).mul(1000).mul(1000).mul(1000).mul(1000),
        t: new Decimal(1).mul(1000).mul(1000).mul(1000).mul(1000).mul(1000),
    };
    let values: Record<string, string> = $state({});
    let lang: Record<string, string> = {};
    let errs: Record<string, boolean> = $state({});

    function change(unit: string) {
        if (values[unit].endsWith(".")) return;
        if (values[unit].endsWith("-")) {
            if (values[unit].startsWith("-")) {
                values[unit] = `${values[unit].slice(1, -1)}`;
            } else {
                values[unit] = `-${values[unit].slice(0, -1)}`;
            }
            if (values[unit] == "0" || values[unit] == "-0") return;
        }
        errs[unit] = false;
        if (!errs[unit]) {
            if (!values[unit]) values[unit] = "0";
            if (isNaN(parseFloat(values[unit]))) return (errs[unit] = true);
            values[unit] = parseFloat(values[unit]).toString();
            for (let v of Object.keys(values)) {
                if (v == unit) continue;
                const c = new Decimal(mapping[v]).div(new Decimal(mapping[unit]));
                values[v] = new Decimal(values[unit]).div(c).toString();
            }
        }
    }

    function load() {
        for (let unit of Object.keys(mapping)) {
            if (!Object.keys(values).includes(unit)) {
                values[unit] = "0";
            }
        }

        for (let unit of Object.keys(mapping)) {
            if (!Object.keys(lang).includes(unit)) {
                lang[unit] = unit;
            }
        }
    }

    load();
</script>

<Container back_to={"/tool/converters"}>
    <h1>質量換算</h1>
    <hr />
    <div class="main">
        {#each Object.keys(values) as k}
            <div>
                <input class:err={errs[k]} bind:value={values[k]} oninput={(_) => change(k)} />
                <span>{lang[k]}</span>
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
        width: 50px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
