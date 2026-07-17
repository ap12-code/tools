<script lang="ts">
    import { type CompoundTag } from 'nbtify';
    import NBTValue from './NBTValue.svelte';
    import Icon from '@iconify/svelte';

    interface Props {
        key: string;
        tag: CompoundTag;
        depth: number;
    }

    let { tag = $bindable(), depth, key }: Props = $props();
</script>

<div class="nbt-compound" class:tree={key != ''} style:margin-left={key != '' ? `10px` : ''}>
    {#each Object.entries(tag) as [nextKey, value]}
        {#if value !== undefined}
            <NBTValue key={nextKey} depth={depth + 1} bind:tag={() => value, (v) => (tag[nextKey] = v)} />
        {/if}
    {/each}
    {#if key != ''}
        <div class="button tree-element" style:margin-left={'10px'}>
            <button><Icon icon="material-symbols:add" inline /></button>
        </div>
    {/if}
</div>

<style>
    .nbt-compound {
        margin-top: 5px;
        display: block;
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
