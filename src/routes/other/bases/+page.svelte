<script lang="ts">
    import Container from "$components/Container.svelte";

    let mapping: Record<string, number> = {hex: 16, dec: 10, oct: 8, bin: 2}
    let tests: Record<string, RegExp> = {hex: /^[0-9a-f]+$/, dec: /^[0-9]+$/, oct: /^[0-7]+$/, bin: /^[01]+$/}
    let vaules: Record<string, string> = {hex: "0", dec: "0", oct: "0", bin: "0"}
    let errs: Record<string, boolean> = {hex: false, dec: false, oct: false, bin: false}

    function verify() {
        Object.keys(errs).forEach(elm => {
            errs[elm] = false
            if (!tests[elm].test(vaules[elm])) {
                errs[elm] = true
            }
        });
    }

    function change(radix: string) {
        verify()
        if (!errs[radix]) {
            for (let v of Object.keys(vaules)) {
                vaules[v] = parseInt(vaules[radix], mapping[radix]).toString(mapping[v])
            }
        }
    }
</script>
<Container>
    <h3>基数変換</h3>
    <div class="main">
        <div>
            <p>16進数</p>
            <input class:err={errs.hex} bind:value={vaules.hex} on:input={_ => change("hex")}>
        </div>
        <div>
            <p>10進数</p>
            <input class:err={errs.dec} bind:value={vaules.dec} on:input={_ => change("dec")}>
        </div>
        <div>
            <p>8進数</p>
            <input class:err={errs.oct} bind:value={vaules.oct} on:input={_ => change("oct")}>
        </div>
        <div>
            <p>2進数</p>
            <input class:err={errs.bin} bind:value={vaules.bin} on:input={_ => change("bin")}>
        </div>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .err {
        border-color: #d00;
    }
    input {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
        height: 14px;
        border: #666 1px solid;
    }
    input:focus {
        outline: none;
    }
</style>