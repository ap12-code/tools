<script lang="ts">
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';

    interface Props {
        files: File[];
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
                .map((x) => x.getAsFile());
            const handles = (await Promise.all(promises)).filter((x) => x !== null && x instanceof FileSystemFileHandle);
            files.push(...handles);
            onchange();
            hovering = false;
        });
        element.addEventListener('dragleave', () => {
            hovering = false;
        });
        element.addEventListener('dragover', () => {
            hovering = true;
        });
    });
</script>

<div class="dropzone-parent">
    <Icon icon="material-symbols:drive-folder-upload" color="dropzone" width="50px" height="50px"></Icon>
    <input type="file" class="dropzone" class:hovering {id} />
</div>

<style>
    .dropzone-parent {
        text-align: center;
        background: none;
        border: none;
    }
    .dropzone {
        appearance: none;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 200px;
        border: #666 1px dotted;
        border-radius: 5px;
        color: #777;
    }
    .dropzone::file-selector-button {
        text-align: center;
        background: none;
        border: none;
        color: transparent;
    }
    .hovering {
        border: #fff 1px solid;
    }
    .dropzone :global(.dz-message) {
        display: none;
    }
</style>
