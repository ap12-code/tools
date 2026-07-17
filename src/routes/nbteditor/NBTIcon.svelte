<script lang="ts">
    interface Props {
        tagType: number;
        width?: string;
    }

    let { tagType, width = '14px' }: Props = $props();
</script>

<img class="nbt-icon" src={`/nbt/${tagType}.png`} alt={tagType.toString()} {width} height={width} />

<style>
    .nbt-icon {
        display: inline;
        z-index: 3;
        vertical-align: -2px;
    }
</style>
