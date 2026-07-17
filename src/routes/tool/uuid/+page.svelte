<script lang="ts">
    import Container from '$components/Container.svelte';

    let amount = $state(4);
    let noph = $state(false);
    let useupper = $state(false);
    let uuids: string[] = $state([]);
    function gen() {
        if (amount <= 0) amount = 1;
        uuids = [];
        for (let i = 0; i < amount; i++) {
            let uuid: string = crypto.randomUUID();
            if (noph) {
                uuid = uuid.replace(/-/g, '');
            }
            if (useupper) {
                uuid = uuid.toUpperCase();
            }
            uuids.push(uuid);
        }
    }
    function copy(data: string) {
        navigator.clipboard.writeText(data);
    }
    gen();
</script>

<Container>
    <h1>UUIDジェネレーター</h1>
    <hr />
    <div class="main">
        <div>
            <div class="controls">
                <div class="checks">
                    <input bind:checked={noph} onchange={gen} type="checkbox" class="checkbox" id="no-ph" />
                    <label for="no-ph">ハイフンなし</label>
                </div>
                <div class="checks">
                    <input bind:checked={useupper} onchange={gen} type="checkbox" class="checkbox" id="use-upper" />
                    <label for="use-upper">大文字</label>
                </div>
                <div class="counts">
                    <label for="amount">生成数</label>
                    <input bind:value={amount} onchange={gen} min={1} max={50} type="number" id="amount" />
                </div>
                <button onclick={gen}>再生成</button>
            </div>
            {#each uuids as uuid, i}
                <div class="item">
                    <input type="text" readonly={true} bind:value={uuids[i]} />
                    <button onclick={(_) => copy(uuid)}>コピー</button>
                </div>
            {/each}
        </div>
    </div>
</Container>

<style>
    .checks {
        display: flex;
        align-items: center;
    }
    .checks label {
        cursor: pointer;
    }
    .controls {
        display: flex;
        gap: 20px;
        align-items: center;
    }
    .checkbox {
        cursor: pointer;
        appearance: none;
        height: 24px;
        width: 24px;
        margin: 4px;
        border: 1px solid #8b98a5;
        border-radius: 4px;
    }
    .checkbox:checked {
        border: 1px solid #8b98a5;
        background-color: #fff;
    }
    .checkbox:checked::before {
        display: inline-block;
        position: absolute;
        color: #000;
        height: 24px;
        width: 18px;
        padding: 2px;
        vertical-align: -0.125em;
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z'/%3E%3C/svg%3E");
    }
    .checkbox:focus-visible {
        outline: none;
    }
    .counts > input {
        background-color: #222;
        padding: 5px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 24px;
    }
    .counts {
        height: 100%;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 20%;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        transition: 0.2s all;
    }
    button:hover {
        background-color: #666;
        transition: 0.2s all;
        cursor: pointer;
    }
    .item {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        height: 30px;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    input[type='text'] {
        width: 100%;
        padding: 5px;
        background-color: #222;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
    }
</style>
