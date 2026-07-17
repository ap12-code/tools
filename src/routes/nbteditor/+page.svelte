<script lang="ts">
    import Container from '$components/Container.svelte';
    import { read, NBTData, write as nbtWrite, type RootTag } from 'nbtify';
    import FileUpload from '$components/FileUpload.svelte';
    import NBTValue from './NBTValue.svelte';
    import Menu from '$components/menu/Menu.svelte';
    import MenuItem from '$components/menu/MenuItem.svelte';
    import MenuDivider from '$components/menu/MenuDivider.svelte';
    import { slide } from 'svelte/transition';
    import SaveConfirmDialog from '$components/SaveConfirmDialog.svelte';

    let files: FileSystemFileHandle[] = $state([]);
    let currentFile: FileSystemFileHandle | null = $state(null);
    let uploaded: boolean = $state(false);
    let loading: boolean = $state(false);
    let saving: boolean = $state(false);
    let saved: boolean = $state(false);
    let menuDisabled: boolean = $state(false);
    let nbt: NBTData = $state(new NBTData({}));
    let saveConfirm: boolean = $state(false);
    let currentData: RootTag = $state({});
    let indicator: boolean = $state(false);
    let indicatorMessage: string = $state('');

    async function verifyHandlePermission(handle: FileSystemHandle): Promise<boolean> {
        if ((await handle.queryPermission({ mode: 'readwrite' })) === 'granted') return true;
        if ((await handle.requestPermission({ mode: 'readwrite' })) === 'granted') return true;
        return false;
    }

    async function menuAction_openFile() {
        menuDisabled = true;
        try {
            const picker = await window.showOpenFilePicker();
            if (picker.length <= 0) {
                menuDisabled = false;
                return;
            }
            files.push(picker[0]);
            await update();
            menuDisabled = false;
        } catch (e) {
        } finally {
            menuDisabled = false;
        }
    }

    async function menuAction_closeFile() {
        menuDisabled = true;
        await closeFile();
        menuDisabled = false;
    }

    async function menuAction_save() {
        menuDisabled = true;
        await save();
        menuDisabled = false;
    }

    async function menuAction_saveAs() {
        menuDisabled = true;
        await saveAs();
        menuDisabled = false;
    }

    async function save() {
        if (currentFile === null) return;

        write(currentFile);
    }

    async function saveAs() {
        if (currentFile === null) return;
        try {
            const file = await window.showSaveFilePicker({ suggestedName: currentFile.name, startIn: currentFile });
            await write(file);
        } catch (e) {}
    }

    async function write(file: FileSystemFileHandle) {
        if (currentFile === null) return;

        updateIndicator('保存中...');
        const writable = await currentFile.createWritable({ keepExistingData: false });
        const compressed = await nbtWrite(currentData, nbt);
        await writable.write({ type: 'write', position: 0, data: compressed.buffer as ArrayBuffer });
        await writable.close();
        updateIndicator('保存しました');
    }

    async function update() {
        const fsHandle = files?.[0];
        if (!fsHandle) return;
        if (!(await verifyHandlePermission(fsHandle))) {
            console.log('error: failed to verify rw permission.');
            return;
        }
        uploaded = true;
        updateIndicator('ファイルを開いています...');

        const file = await fsHandle.getFile();
        updateIndicator('NBTを読み込み中...');

        nbt = await read(await file.arrayBuffer());
        currentFile = fsHandle;
        loading = false;
        currentData = nbt.data;
        updateIndicator('読み込みました');
    }

    async function closeFile() {
        nbt = new NBTData({});
        currentData = {};
        uploaded = false;
        currentFile = null;
        files = [];
    }

    async function updateData(tag: RootTag) {
        currentData = tag;
    }

    let indicatorInterval: NodeJS.Timeout | null = $state(null);
    function updateIndicator(message: string = '') {
        indicator = message != '';
        indicatorMessage = message;

        if (indicatorInterval != null) clearInterval(indicatorInterval);
        if (message != '') indicatorInterval = setTimeout(updateIndicator, 2000);
    }
</script>

{#if currentFile != null}
    <SaveConfirmDialog filename={currentFile.name} bind:show={saveConfirm} accept={closeFile} {save} />
{/if}

<Container full show_back={false}>
    <div class="nav">
        <Menu id="file" label="ファイル" disabled={menuDisabled}>
            <MenuItem onclick={menuAction_openFile} id="open" label="開く" />
            {#if currentFile != null}
                <MenuDivider />
                <MenuItem onclick={menuAction_save} id="save" label="上書き保存" />
                <MenuItem onclick={menuAction_saveAs} id="saveAs" label="別名で保存" />
                <MenuDivider />
                <MenuItem onclick={menuAction_closeFile} id="close" label="閉じる" />
            {/if}
        </Menu>
        <Menu id="edit" label="編集" disabled={menuDisabled}>
            <MenuItem onclick={() => {}} id="open" label="開く" />
        </Menu>
    </div>
    <div>
        {#if !uploaded}
            <div class="input">
                <span></span>
                <FileUpload bind:files onchange={update} />
            </div>
        {:else}
            <div class="code">
                <pre><NBTValue key={currentFile?.name || ''} depth={0} bind:tag={() => currentData, (v) => updateData(v)} /></pre>
            </div>
        {/if}
        {#if indicator}
            <div class="save-indicator" transition:slide={{ axis: 'y' }}>
                <span>{indicatorMessage}</span>
            </div>
        {/if}
    </div>
</Container>

<style>
    .nav {
        position: fixed;
        display: flex;
        top: 0px;
        left: 0px;
        padding-bottom: 5px;
        padding-left: 5px;
        background-color: #222;
        border-bottom: 1px solid #666;
        width: 100%;
        gap: 5px;
    }
    .nav :global(.menu) {
        width: 80px;
    }
    .input {
        margin: 20px 0;
    }
    .code {
        background-color: #111;
        padding: 3px 10px;
        border-radius: 10px;
    }
    .save-indicator {
        position: fixed;
        bottom: 0px;
        left: 0;
        background-color: #222;
        text-align: center;
        width: 100%;
    }
    pre {
        padding: 10px 0;
        margin: 0;
    }
</style>
