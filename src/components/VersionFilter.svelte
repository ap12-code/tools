<script lang="ts">
    import Icon from '@iconify/svelte';
    import Button from './Button.svelte';
    import Dialog from './Dialog.svelte';
    import CheckBox from './form/CheckBox.svelte';
    import Buttons from './Buttons.svelte';
    import Text from './form/Text.svelte';
    import type { VersionFilterOptions } from '$lib/minecraft/version_filter.svelte';

    let shown: boolean = $state(false);
    interface Props {
        title?: string;
        filter: VersionFilterOptions;
        apply?: () => any;
    }

    function closeWith<T extends CallableFunction>(callback: T) {
        callback();
        close();
    }

    function reset() {
        filter.reset();
        close();
    }

    function close() {
        shown = false;
    }

    let { filter = $bindable(), apply = () => {}, title }: Props = $props();
</script>

<button onclick={() => (shown = !shown)}>
    <Icon icon="material-symbols:filter-alt" width="18px" height="18px" inline></Icon>
</button>
<Dialog show={shown} title={title || 'バージョンのフィルタ'}>
    <div>
        <p>種別</p>
        <CheckBox bind:checked={filter.type_release} label="リリース"></CheckBox>
        <CheckBox bind:checked={filter.type_snapshot} label="スナップショット"></CheckBox>
    </div>
    <div>
        <p>検索</p>
        <Text placeholder="検索..." bind:value={filter.keyword}></Text>
    </div>
    <br />
    <Buttons>
        <Button style="green" onclick={() => closeWith(apply)}>
            <Icon icon="material-symbols:filter-alt" inline /> 適応
        </Button>
        <Button style="red" onclick={reset}>
            <Icon icon="material-symbols:reset-settings" inline /> リセット
        </Button>
        <Button style="white" onclick={close}>
            <Icon icon="material-symbols:close" inline /> キャンセル
        </Button>
    </Buttons>
</Dialog>

<style>
    button {
        padding: 5px;
        background-color: #222;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 32px;
        transition: 0.2s all;
    }
    button:hover {
        background-color: #666;
    }
    button:disabled {
        background-color: #444;
    }
</style>
