<script lang="ts">
    import Container from "$components/Container.svelte";
    import { Decimal } from "decimal.js";
    import _ from "lodash";
    import { onMount } from "svelte";

    let values: Record<string, string> = $state({
        c: "25",
        f: "0",
        k: "0",
    });
    let errs: Record<string, boolean> = $state({});

    function change(unit: string) {
        errs[unit] = false;
        if (values[unit] == "") values[unit] = "0";
        if (!Number.isNaN(values[unit]) && !values[unit].endsWith("-")) {
            const current = new Decimal(values[unit]);
            values[unit] = current.toString();
            switch (unit) {
                case "c":
                    values["f"] = current.mul(new Decimal(9).div(5)).add(32).toString();
                    values["k"] = current.add(273.15).toString();
                    break;
                case "f":
                    values["c"] = current.sub(32).mul(new Decimal(5).div(9)).toString();
                    values["k"] = current.sub(32).mul(new Decimal(5).div(9)).add(273.15).toString();
                    break;
                case "k":
                    values["f"] = current.sub(273.15).mul(new Decimal(9).div(5)).add(32).toString();
                    values["c"] = current.sub(273.15).toString();
                    break;
            }
        } else {
            if (values[unit].endsWith("-")) {
                values[unit] = "-";
            } else {
                errs[unit] = true;
            }
        }
    }

    onMount(() => change("c"));
</script>

<Container back_to={"/tool/converters"}>
    <h1>温度換算</h1>
    <hr />
    <div class="main">
        <div>
            <input class:err={errs.c} bind:value={values.c} oninput={(_) => change("c")} />
            <span>℃(摂氏)</span>
        </div>
        <div>
            <input class:err={errs.f} bind:value={values.f} oninput={(_) => change("f")} />
            <span>℉(華氏)</span>
        </div>
        <div>
            <input class:err={errs.k} bind:value={values.k} oninput={(_) => change("k")} />
            <span>K(ケルビン)</span>
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
        text-align: start;
        width: 150px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
