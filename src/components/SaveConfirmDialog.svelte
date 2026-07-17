<script lang="ts">
    import Button from './Button.svelte';
    import Buttons from './Buttons.svelte';
    import Dialog from './Dialog.svelte';

    type Handler = () => any;
    interface Props {
        filename: string;
        show: boolean;
        save: Handler;
        accept: Handler;
    }
    let { filename, show = $bindable(), save, accept }: Props = $props();

    function cancel() {
        show = false;
    }
    async function close() {
        await accept();
        show = false;
    }
    async function saveAndClose() {
        await save();
        await close();
    }
</script>

<Dialog>
    <p>{filename} への変更内容を保存しますか?</p>
    <Buttons>
        <Button onclick={saveAndClose}>保存</Button>
        <Button onclick={close}>保存しない</Button>
        <Button onclick={cancel}>キャンセル</Button>
    </Buttons>
</Dialog>
