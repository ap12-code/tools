<script lang="ts">
    import { read, NBTData, stringify } from 'nbtify';

    let files: FileList;
    let names: string[] = [];
    let nbt: NBTData = new NBTData({});

    async function update() {
        const file = files[0];
        if (!file) return;

        nbt = await read(await file.arrayBuffer());
    }
</script>

<div class="settings">
    <div class="input">
        <input type="file" bind:files on:change={update} />
    </div>
    <div class="code">
        {#key nbt}
            <pre>{stringify(nbt, { space: 4 })}</pre>
        {/key}
    </div>
</div>

<style>
    .settings {
        margin: 20px;
        height: 100%;
    }
    .input {
        margin: 20px 0;
    }
    .code {
        background-color: #111;
        padding: 3px 10px;
        border-radius: 10px;
    }
    pre {
        overflow-y: scroll;
        max-height: 75vh;
    }
</style>
