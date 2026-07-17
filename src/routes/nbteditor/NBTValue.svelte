<script lang="ts">
    import {
        Float32,
        getTagType,
        Int16,
        Int32,
        Int8,
        TAG,
        type ByteArrayTag,
        type ByteTag,
        type CompoundTag,
        type DoubleTag,
        type FloatTag,
        type IntArrayTag,
        type IntTag,
        type ListTag,
        type LongArrayTag,
        type LongTag,
        type ShortTag,
        type Tag
    } from 'nbtify';
    import NBTList from './NBTList.svelte';
    import NBTIcon from './NBTIcon.svelte';
    import NBTCompound from './NBTCompound.svelte';
    import Icon from '@iconify/svelte';
    import NBTValueEditDialog from './NBTValueEditDialog.svelte';

    interface Props {
        key: string;
        rename?: boolean;
        tag: Tag;
        depth: number;
    }

    let { tag = $bindable(), key, depth, rename = true }: Props = $props();
    const tagType = getTagType(tag);
    const createId = () => `nbtvalue__${new Date().getTime()}__${Math.floor(Math.random() * 100000)}`;

    export type ArrayTag = ByteArrayTag | IntArrayTag | LongArrayTag | ListTag<any>;
    export type NumberTag = ByteTag | ShortTag | IntTag | FloatTag | DoubleTag;
    const isArrayTagType = (tagType: TAG): boolean => [TAG.BYTE_ARRAY, TAG.INT_ARRAY, TAG.LONG_ARRAY, TAG.LIST].includes(tagType);
    const isNumberTagType = (tagType: TAG): boolean => [TAG.BYTE, TAG.DOUBLE, TAG.FLOAT, TAG.INT, TAG.LONG, TAG.SHORT].includes(tagType);
    const isArrayTag = (value: Tag): value is ArrayTag => isArrayTagType(getTagType(value));
    const isNumberTag = (value: Tag): value is NumberTag => isNumberTagType(getTagType(value));
    const isCompoundTag = (value: Tag): value is CompoundTag => getTagType(value) === TAG.COMPOUND;
    const isPrimitiveTag = (tagType: TAG): boolean => isNumberTagType(tagType) || [TAG.STRING].includes(tagType);

    const getArrayType = (value: Tag): TAG | null => (isArrayTag(value) && value[0] !== undefined ? getTagType(value[0]) : null);

    function applyNumberTypeSafed(value: number) {
        switch (getTagType(tag)) {
            case TAG.BYTE:
                tag = new Int8(value);
                break;
            case TAG.SHORT:
                tag = new Int16(value);
                break;
            case TAG.INT:
                tag = new Int32(value);
                break;
            case TAG.LONG:
                tag = BigInt(value);
                break;
            case TAG.FLOAT:
                tag = new Float32(value);
                break;
            case TAG.DOUBLE:
                tag = Number(value);
                break;
        }
    }

    function applyTag<T extends Tag>(value: T) {
        if (isNumberTag(value)) {
            applyNumberTypeSafed(value as number);
        } else if (getTagType(tag) === TAG.LONG) {
            tag = BigInt(value as LongTag);
        }
    }

    let editing: boolean = $state(false);
    const edit = () => (editing = true);

    function updateKey(newKey: string) {}
</script>

<div class="nbt-value tree-element" style:margin-left={key != '' ? '10px' : ''}>
    <NBTValueEditDialog bind:show={editing} bind:key={() => key, updateKey} bind:value={tag} />
    {#if key != ''}
        <span>
            <NBTIcon {tagType} />{#if isArrayTag(tag) && getArrayType(tag)}<NBTIcon tagType={getArrayType(tag)!!} />{/if}
            {key}:
        </span>
    {/if}
    {#if tagType === TAG.STRING}
        <input id={createId()} type="text" bind:value={tag} />
    {:else if isCompoundTag(tag)}
        <NBTCompound {depth} {key} bind:tag />
    {:else if isArrayTag(tag)}
        <NBTList {depth} {key} bind:tag />
    {:else if isNumberTagType(tagType)}
        <input id={createId()} type="number" bind:value={() => tag, (v) => applyTag(v)} />
    {/if}
    {#if isPrimitiveTag(tagType)}
        {#if rename}
            <button onclick={edit}><Icon icon="material-symbols:edit" inline /></button>
        {/if}
        <button><Icon icon="material-symbols:delete" inline /></button>
    {/if}
</div>

<style>
    .nbt-value {
        display: block;
    }
    span {
        font-family: monospace;
    }
    input {
        color: #fff;
        background-color: #222;
        border: 1px solid #666;
        border-radius: 5px;
        outline: none;
    }

    button {
        cursor: pointer;
        transition: all 0.2s;
        background-color: #222;
        color: #fff;
        border: 1px solid #666;
        border-radius: 5px;
    }
    button:hover {
        background-color: #444;
    }
</style>
