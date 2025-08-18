<script lang="ts">
    import Container from '$components/Container.svelte';
    let n = $state(0);
    let use_lc = $state(true);
    let mapping: Record<string, number> = { lc: 3456, sb: 1728, stack: 64, item: 1 };
    let vaules: Record<string, string> = $state({ lc: '0', sb: '0', stack: '0', item: '0' });
    let errs: Record<string, boolean> = $state({ lc: false, sb: false, stack: false, item: false, n: false });

    function isInteger(n: string): boolean {
        if (n == '') return false;
        return !isNaN(parseInt(n));
    }

    function verify() {
        errs.n = false;
        if (!Number.isInteger(n)) {
            errs.n = true;
        }

        Object.keys(errs).forEach((elm) => {
            if (elm == 'n') return;
            errs[elm] = false;
            if (!isInteger(vaules[elm])) {
                errs[elm] = true;
            }
        });
    }

    function changeUseLC() {
        verify();
        if (errs.lc) return;

        if (use_lc) {
            vaules.sb = (parseInt(vaules.lc) * 2).toString();
        } else {
            const c = parseInt(vaules.sb);
            vaules.sb = (c % 2).toString();
            vaules.lc = Math.floor(c / 2).toString();
        }
    }

    function changeInput() {
        verify();
        if (errs.n) return;

        let tmp_n = n;
        for (let v of Object.keys(mapping)) {
            if (!use_lc && v == 'lc') continue;
            if (mapping[v] == 1) {
                vaules[v] = tmp_n.toString();
                continue;
            }
            vaules[v] = Math.floor(tmp_n / mapping[v]).toString();
            tmp_n = tmp_n % mapping[v];
        }
    }

    function change(key: string) {
        verify();
        n = 0;
        if (!errs[key]) {
            for (let v of Object.keys(vaules)) {
                if (!use_lc && v == 'lc') continue;
                if (parseInt(vaules[v]) == 0) continue;
                n += parseInt(vaules[v]) * mapping[v];
            }
        }

        changeInput();
    }
</script>

<Container>
    <h1>スタック換算</h1>
    <p>チェストとかの単位を変換します。分解と合算両方できます</p>
    <hr />
    <div class="main">
        <div>
            {#if use_lc}
                <div class="field">
                    <input type="number" class:err={errs.lc} min="0" bind:value={vaules.lc} oninput={(_) => change('lc')} />
                    <span>LC</span>
                </div>
            {/if}
            <div class="field">
                <input type="number" class:err={errs.sb} min="0" bind:value={vaules.sb} oninput={(_) => change('sb')} />
                {#if use_lc}
                    <span>チェスト</span>
                {:else}
                    <span>SB</span>
                {/if}
            </div>
            <div class="field">
                <input type="number" class:err={errs.stack} min="0" bind:value={vaules.stack} oninput={(_) => change('stack')} />
                <span>スタック</span>
            </div>
            <div class="field">
                <input type="number" class:err={errs.item} min="0" bind:value={vaules.item} oninput={(_) => change('item')} />
                <span>個</span>
            </div>
        </div>

        <div>
            <div class="field2">
                <input type="checkbox" id="cb-0" bind:checked={use_lc} oninput={changeUseLC} />
                <label for="cb-0">LCを使用する</label>
            </div>
        </div>

        <div>
            <p>合計</p>
            <div class="field">
                <input type="number" class:err={errs.n} min="0" bind:value={n} oninput={changeInput} />
                <span>アイテム</span>
            </div>
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
    input[type='number'] {
        flex-grow: 1;
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
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    .field {
        display: flex;
        gap: 10px;
        margin: 10px 0;
    }
    .field span {
        width: 100px;
    }
    .field2 {
        display: flex;
        align-items: center;
    }
    .field2 input[type='checkbox'] {
        display: block;
        height: 15px;
        width: 15px;
        background-color: #222;
        border-radius: 10px;
        margin: 0 10px;
    }
    .field2 label {
        line-height: 15px;
    }
</style>
