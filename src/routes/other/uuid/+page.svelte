<script lang="ts">
    import Container from "$components/Container.svelte";

    let amount = 4
    let noph = false
    let uuids: string[] = []
    function gen() {
        uuids = []
        for (let i = 0; i < amount; i++) {
            let uuid: string = crypto.randomUUID()
            if (noph) {
                uuid = uuid.replace(/-/g, "")
            }
            uuids.push(uuid)
        }
    }
    function copy(data: string) {
        navigator.clipboard.writeText(data)
    }
    gen()
</script>
<Container>
    <h3>UUIDジェネレーター</h3>
    <div class="main">
        <div>
            <div class="controls">
                <div class="checks">
                    <input bind:checked={noph} on:change={gen} type="checkbox" class="checkbox" id="no-ph">
                    <label for="no-ph">ハイフンなし</label>
                </div>
                <div class="counts">
                    <label for="amount">生成数</label>
                    <input bind:value={amount} on:change={gen} type="number" id="amount">
                </div>
                <button on:click={gen}>再生成</button>
            </div>
            {#each uuids as uuid}
                <div class="item">
                    <textarea readonly bind:value={uuid}></textarea>
                    <button on:click={_ => copy(uuid)}>コピー</button>
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
        display: grid;
        place-content: center;
        color: #000;
        height: 100%;
        font-family: "bootstrap-icons";
        font-size: 18px;
        content: "\F633";
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
    textarea {
        flex-grow: 1;
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
        font-size: 14px;
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
</style>