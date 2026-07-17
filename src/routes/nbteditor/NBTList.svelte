<script lang="ts">
    import NBTValue, { type ArrayTag } from './NBTValue.svelte';
    import Icon from '@iconify/svelte';

    interface Props {
        key: string;
        tag: ArrayTag;
        depth: number;
    }

    let { tag = $bindable(), depth, key }: Props = $props();
</script>

<div class="nbt-list tree" style:margin-left={'10px'}>
    {#each tag as value, index}
        {#if value && depth < 100}
            <NBTValue rename={false} bind:tag={() => value, (v) => (tag[index] = v)} depth={depth + 1} key={`${index + 1}`}></NBTValue>
        {/if}
    {/each}
    <div class="tree-element" style:margin-left={'10px'}>
        <button><Icon icon="material-symbols:add" inline /></button>
    </div>
</div>

<style>
    .nbt-list {
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
