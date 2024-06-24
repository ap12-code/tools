<script lang="ts">
    import Container from "$components/Container.svelte";
    import { Decimal } from "decimal.js";

    let mapping: Record<string, Decimal> = {
        b: new Decimal(1),
        bi: new Decimal(8),
        ki: new Decimal(8).mul(1024),
        kb: new Decimal(8).mul(1000),
        mi: new Decimal(8).mul(1024).mul(1024),
        mb: new Decimal(8).mul(1000).mul(1000),
        gi: new Decimal(8).mul(1024).mul(1024).mul(1024),
        gb: new Decimal(8).mul(1000).mul(1000).mul(1000),
        ti: new Decimal(8).mul(1024).mul(1024).mul(1024).mul(1024),
        tb: new Decimal(8).mul(1000).mul(1000).mul(1000).mul(1000),
    };
    let values: Record<string, string> = {
        b: "0",
        bi: "0",
        ki: "0",
        kb: "0",
        mi: "0",
        mb: "0",
        gi: "0",
        gb: "0",
        ti: "0",
        tb: "0",
    };
    const lang: Record<string, string> = {
        b: "b",
        bi: "B",
        ki: "KiB",
        kb: "KB",
        mi: "MiB",
        mb: "MB",
        gi: "GiB",
        gb: "GB",
        ti: "TiB",
        tb: "TB",
    };
    let errs: Record<string, boolean> = {};

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
</script>

<Container back_to={"/tool/converters"}>
    <h1>データ容量換算</h1>
    <hr />
    <div class="main">
        {#each Object.keys(values) as k}
            <div>
                <input class:err={errs[k]} bind:value={values[k]} on:input={(_) => change(k)} />
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
