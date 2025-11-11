<script lang="ts">
    import Container from '$components/Container.svelte';
    import Text from '$components/form/Text.svelte';

    let mapping: Record<string, number> = { hex: 16, dec: 10, oct: 8, bin: 2 };
    let tests: Record<string, RegExp> = { hex: /^[0-9a-f]+$/, dec: /^[0-9]+$/, oct: /^[0-7]+$/, bin: /^[01]+$/ };
    let vaules: Record<string, string> = $state({ hex: '0', dec: '0', oct: '0', bin: '0' });
    let errs: Record<string, boolean> = $state({ hex: false, dec: false, oct: false, bin: false });

    function verify() {
        Object.keys(errs).forEach((elm) => {
            errs[elm] = false;
            if (!tests[elm].test(vaules[elm])) {
                errs[elm] = true;
            }
        });
    }

    function change(radix: string) {
        verify();
        if (vaules[radix] == '') vaules[radix] = '0';
        if (!errs[radix]) {
            for (let v of Object.keys(vaules)) {
                vaules[v] = parseInt(vaules[radix], mapping[radix]).toString(mapping[v]);
            }
        }
    }
</script>

<Container>
    <h1>基数変換</h1>
    <p>
        16進<i class="bi bi-arrow-left-right"></i>10進<i class="bi bi-arrow-left-right"></i>8進<i class="bi bi-arrow-left-right"
        ></i>2進数を相互変換します
    </p>
    <hr />
    <div class="main">
        <div>
            <p>16進数</p>
            <Text error={errs.hex} bind:value={vaules.hex} oninput={() => change('hex')} copyable />
        </div>
        <div>
            <p>10進数</p>
            <Text error={errs.dec} bind:value={vaules.dec} oninput={() => change('dec')} copyable />
        </div>
        <div>
            <p>8進数</p>
            <Text error={errs.oct} bind:value={vaules.oct} oninput={() => change('oct')} copyable />
        </div>
        <div>
            <p>2進数</p>
            <Text error={errs.bin} bind:value={vaules.bin} oninput={() => change('bin')} copyable />
        </div>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
