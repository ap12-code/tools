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
    let vaules: Record<string, string> = {
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
    let errs: Record<string, boolean> = {};

    function change(unit: string) {
        errs[unit] = false;
        if (!errs[unit]) {
            if (!vaules[unit]) vaules[unit] = "0";
            if (isNaN(parseInt(vaules[unit]))) return (errs[unit] = true);
            vaules[unit] = parseInt(vaules[unit]).toString();
            for (let v of Object.keys(vaules)) {
                if (v == unit) continue;
                const c = new Decimal(mapping[v]).div(new Decimal(mapping[unit]));
                vaules[v] = new Decimal(vaules[unit]).div(c).toString();
            }
        }
    }
</script>

<Container back_to={"/tool/converters"}>
    <h1>データ容量換算</h1>
    <hr />
    <div class="main">
        <div>
            <input class:err={errs.b} bind:value={vaules.b} on:input={(_) => change("b")} />
            <span>b</span>
        </div>
        <div>
            <input class:err={errs.bi} bind:value={vaules.bi} on:input={(_) => change("bi")} />
            <span>B</span>
        </div>

        <div>
            <input class:err={errs.kb} bind:value={vaules.kb} on:input={(_) => change("kb")} />
            <span>kB</span>
        </div>
        <div>
            <input class:err={errs.ki} bind:value={vaules.ki} on:input={(_) => change("ki")} />
            <span>KiB</span>
        </div>

        <div>
            <input class:err={errs.mb} bind:value={vaules.mb} on:input={(_) => change("mb")} />
            <span>MB</span>
        </div>
        <div>
            <input class:err={errs.mi} bind:value={vaules.mi} on:input={(_) => change("mi")} />
            <span>MiB</span>
        </div>

        <div>
            <input class:err={errs.gb} bind:value={vaules.gb} on:input={(_) => change("gb")} />
            <span>GB</span>
        </div>
        <div>
            <input class:err={errs.gi} bind:value={vaules.gi} on:input={(_) => change("gi")} />
            <span>GiB</span>
        </div>

        <div>
            <input class:err={errs.tb} bind:value={vaules.tb} on:input={(_) => change("tb")} />
            <span>TB</span>
        </div>
        <div>
            <input class:err={errs.ti} bind:value={vaules.ti} on:input={(_) => change("ti")} />
            <span>TiB</span>
        </div>
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
