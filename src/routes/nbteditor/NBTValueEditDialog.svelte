<script lang="ts">
    import Dialog from '$components/Dialog.svelte';
    import Text from '$components/form/Text.svelte';
    import { getTagType, TAG, type Tag } from 'nbtify';
    import NBTIcon from './NBTIcon.svelte';
    import Button from '$components/Button.svelte';
    import Buttons from '$components/Buttons.svelte';

    interface Props {
        key?: string;
        value?: Tag;
        show?: boolean;
    }
    let { key = $bindable(), value = $bindable(), show = $bindable() }: Props = $props();
    let dataType: TAG | null = $derived(getTagType(value));

    const descriptionMap: Record<number, string> = {
        1: 'Byte',
        2: 'Short',
        3: 'Int',
        4: 'Long',
        5: 'Float',
        6: 'Double',
        7: 'Byte Array',
        8: 'String',
        9: 'List',
        10: 'Compound',
        11: 'Int Array',
        12: 'Long Array'
    };

    async function apply() {
        show = false;
    }

    function changeDataType(newType: TAG) {
        dataType = newType;
    }
</script>

<Dialog bind:show title="編集...">
    <div class="key">
        <Text label="キー" bind:value={key} />
    </div>
    <hr />
    <p>データ型</p>
    <div class="types">
        {#each { length: 12 }, i}
            <label class="type">
                <NBTIcon width={'32px'} tagType={i + 1} />
                <p>{descriptionMap[i + 1]}</p>
                <input name="nbt_type_select" type="radio" oninput={() => changeDataType(i)} />
            </label>
        {/each}
    </div>
    <hr />
    <p>値</p>
    <div class="value"></div>
    <hr />
    <Buttons>
        <Button onclick={apply}>適応</Button>
        <Button onclick={() => (show = false)}>キャンセル</Button>
    </Buttons>
</Dialog>

<style>
    .types {
        display: flex;
        gap: 10px;
        padding: 20px 0;
    }
    .type {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100px;
        gap: 10px;
        user-select: none;
    }
    input[type='radio'] {
        margin: 0;
        position: relative;
        border: #666 1px solid;
        color: #fff;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        appearance: none;
        vertical-align: -3px;
    }
    input[type='radio']:checked:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #999;
    }
</style>
