<script lang="ts">
    import { page } from '$app/state';
    import Button from '$components/Button.svelte';
    import Buttons from '$components/Buttons.svelte';
    import Container from '$components/Container.svelte';
    import CopyButton from '$components/CopyButton.svelte';
    import CheckBox from '$components/form/CheckBox.svelte';
    import Text from '$components/form/Text.svelte';
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import z from 'zod';

    const HexSchema = z.string().regex(/^[0-9a-fA-F]{32}$/);
    const StorageSchema = z.object({
        uuid: HexSchema,
        minecraft: z.boolean(),
        noph: z.boolean(),
        useupper: z.boolean()
    });
    let uuid = new Uint8Array(16);
    let uuidView = new DataView(uuid.buffer);
    const UUID_GROUP_SIZES = [8, 4, 4, 4, 12];

    let hex: string = $state('');
    let ver: string = $state('');
    let minecraft: boolean = $state(false);
    let error: string | null = $state(null);
    let fmtHex: string = $state('');
    let intArray: string[] = $state([]);
    let fmtIntArray: string = $derived(`[I;${intArray[0]},${intArray[1]},${intArray[2]},${intArray[3]}]`);
    let most: string = $state('');
    let least: string = $state('');

    let noph: boolean = $state(false);
    let useupper: boolean = $state(false);

    function onInput(param: string) {
        switch (param) {
            case 'hex':
                hex = fmtHex.trim();
                update();
                break;
            case 'most':
            case 'least':
                updateMostLeast();
                break;
            case 'fmt':
                update();
        }
    }

    function setHex(value: string) {
        hex = value.trim().toLowerCase();
        if (hex.includes('-')) {
            hex = hex
                .split('-')
                .map((n, i) => n.padStart(UUID_GROUP_SIZES[i], '0'))
                .join('');
        }
        hex = hex.replace(/^0+/, '').padStart(32, '0');
    }

    function updateMostLeast() {
        console.log(most, least);
        uuidView.setBigInt64(0, BigInt(most), false);
        uuidView.setBigInt64(8, BigInt(least), false);
        hex = uuidView.getBigInt64(0, false).toString(16) + uuidView.getBigInt64(8, false).toString(16);
        update();
    }

    function update() {
        setHex(hex);
        if (!HexSchema.safeParse(hex).success) {
            error = '無効なUUIDです';
            return;
        }

        uuidView.setBigUint64(0, BigInt('0x' + hex.substring(0, 16)), false);
        uuidView.setBigUint64(8, BigInt('0x' + hex.substring(16)), false);

        const groups = [];
        let offset = 0;
        for (const size of UUID_GROUP_SIZES) {
            groups.push(hex.substring(offset, offset + size));
            offset += size;
        }
        if (noph) {
            fmtHex = groups.join('');
        } else {
            fmtHex = groups.join('-');
        }
        if (useupper) {
            fmtHex = fmtHex.toUpperCase();
        }

        most = uuidView.getBigInt64(0, false).toString();
        least = uuidView.getBigInt64(8, false).toString();
        ver = hex.at(12)!!;

        for (let index = 0; index < 4; index++) {
            intArray[index] = uuidView.getInt32(index * 4, false).toString();
        }
    }

    function random() {
        hex = crypto.randomUUID();
        update();
    }

    function lookupPlayer() {
        localStorage.setItem('data:mc-uuid', hex);
        location.href = `/tool/mcid?q=${fmtHex}&ref=${encodeURIComponent(location.pathname)}`;
    }

    onMount(() => {
        if (page.url.searchParams.has('v')) {
            hex = page.url.searchParams.get('v')!!;
            update();
            return;
        }
        const storage = localStorage.getItem('data:uuid');
        if (!storage) {
            random();
            return;
        }
        const parsedStorage = StorageSchema.safeParse(JSON.parse(storage));
        if (parsedStorage.success) {
            setHex(parsedStorage.data.uuid);
            useupper = parsedStorage.data.useupper;
            noph = parsedStorage.data.noph;
            update();
        } else {
            random();
        }
    });

    $effect(() => {
        localStorage.setItem('data:uuid', JSON.stringify({ uuid: hex.toLowerCase(), minecraft: minecraft, noph: noph, useupper: useupper }));
    });
</script>

<Container>
    <h1>UUID</h1>
    <hr />
    <Text bind:value={fmtHex} oninput={() => onInput('hex')} error={error !== null} error_message={error}></Text>
    <Buttons>
        <Button onclick={() => onInput('hex')}><Icon icon="material-symbols:keyboard-return" class="icon" width="24" height="24" /> 変換</Button>
        <Button onclick={random}><Icon icon="material-symbols:casino" class="icon" width="24" height="24" /> ランダム (v4)</Button>
        <CopyButton data={fmtHex}>コピー</CopyButton>
    </Buttons>
    <div class="controls">
        <div class="checks">
            <CheckBox bind:checked={noph} onchange={() => onInput('fmt')} id="no-ph" />
            <label for="no-ph">ハイフンなし</label>
        </div>
        <div class="checks">
            <CheckBox bind:checked={useupper} onchange={() => onInput('fmt')} id="use-upper" />
            <label for="use-upper">大文字</label>
        </div>
    </div>
    <br />
    <Text copyable={true} read_only label="UUID バージョン" bind:value={ver} oninput={() => onInput('ver')}></Text>
    <br />
    <button
        class="minecraft"
        onclick={() => {
            minecraft = !minecraft;
        }}
    >
        {#if minecraft}
            <Icon icon="material-symbols:arrow-drop-up" width="24" height="24" class="icon" mode="mask"></Icon>
        {:else}
            <Icon icon="material-symbols:arrow-drop-down" width="24" height="24" class="icon" mode="mask"></Icon>
        {/if}
        <span>Minecraft</span>
    </button>
    <div style:display={minecraft ? 'block' : 'none'}>
        <Text copyable={true} label="UUID Most" bind:value={most} oninput={() => onInput('most')}></Text>
        <Text copyable={true} label="UUID Least" bind:value={least} oninput={() => onInput('least')}></Text>
        <br />
        <div class="int-array">
            <p>[I;</p>
            <input type="text" bind:value={intArray[0]} />
            <p>,</p>
            <input type="text" bind:value={intArray[1]} />
            <p>,</p>
            <input type="text" bind:value={intArray[2]} />
            <p>,</p>
            <input type="text" bind:value={intArray[3]} />
            <p>]</p>
        </div>
        <CopyButton data={fmtIntArray}>配列をコピー</CopyButton>
        <div class="spacer"></div>
        <Button onclick={lookupPlayer}><Icon icon="material-symbols:search" class="icon" width="24" height="24" /> プレイヤーを検索</Button>
    </div>
</Container>

<style>
    .int-array {
        display: flex;
        gap: 5px;
        margin: 5px 0;
        padding: 10px;
        border: 1px solid #333;
        border-radius: 5px;
        background-color: #111;
    }
    .int-array > p {
        line-height: 1.5;
        margin: 0;
        font-family: monospace, serif;
        color: #ddd;
    }
    input {
        box-sizing: border-box;
        flex: 1 1;
        padding: 5px;
        background-color: #111;
        resize: none;
        align-content: center;
        border-radius: 5px;
        color: #fff;
        font-family: monospace, serif;
        border: 1px #666 solid;
    }
    input:focus {
        outline: none;
    }
    .minecraft {
        transition: all 0.25s;
        color: #fff;
        background-color: transparent;
        border: none;
        border-radius: 5px;
    }
    .minecraft span {
        font-size: 1.2em;
        vertical-align: 3px;
    }
    .minecraft:hover {
        background-color: #fff3;
    }
    .spacer {
        margin-top: 5px;
    }
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
</style>
