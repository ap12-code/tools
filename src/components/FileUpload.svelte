<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';

    interface Props {
        files: FileSystemFileHandle[];
        onchange?: () => any;
    }

    let { files = $bindable(), onchange = () => {} }: Props = $props();
    let hovering: boolean = $state(false);

    const id = createId();

    function createId(): string {
        return `file__${Math.floor(Math.random() * 100000)}`;
    }

    onMount(() => {
        const element = document.getElementById(id);
        if (element === null) return;

        element.addEventListener('drop', async (event) => {
            if (!event.dataTransfer) return;
            const promises = Array.from(event.dataTransfer.items)
                .filter((x) => x.kind === 'file')
                .map((x) => x.getAsFileSystemHandle());
            const handles = (await Promise.all(promises)).filter((x) => x !== null && x instanceof FileSystemFileHandle);
            files.push(...handles);
            onchange();
            hovering = false;
        });
        element.addEventListener('click', async (event) => {
            const picker = await window.showOpenFilePicker();
            if (picker.length <= 0) return;
            files.push(picker[0]);
            onchange();
        });
        element.addEventListener('dragleave', () => {
            hovering = false;
        });
        element.addEventListener('dragover', () => {
            hovering = true;
        });
    });
</script>

<div class="dropzone" class:hovering {id}>
    <Icon icon="material-symbols:drive-folder-upload" width="50px" height="50px"></Icon>
    {#if hovering}
        <p>ドロップして開く</p>
    {:else}
        <p>クリックまたはドラッグ&ドロップしてファイルを開く</p>
    {/if}
</div>

<style>
    .dropzone {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 200px;
        border: #666 1px dotted;
        border-radius: 5px;
        color: #777;
        text-align: center;
    }
    .hovering {
        border: #fff 1px solid;
    }
    .dropzone :global(.dz-message) {
        display: none;
    }
</style>
