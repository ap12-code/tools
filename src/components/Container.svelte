<script lang="ts">
    interface Props {
        show_back?: boolean;
        back_to?: string;
        children?: import("svelte").Snippet;
        full?: boolean;
    }

    let { show_back = true, back_to = "/", children, full = false }: Props = $props();
</script>

<div class:container={!full}>
    {#if show_back}
        <a class="back" href={back_to}>
            <i class="bi bi-chevron-left"></i>{back_to == "/" ? "ホームに戻る" : "戻る"}
        </a>
    {/if}
    {@render children?.()}
</div>

<style>
    .back {
        color: #fff;
        text-decoration: none;
    }
    .container {
        margin: 20px 100px;
    }
    @media (max-width: 1025px) {
        div {
            margin: 10px 15px;
        }
    }
    @media (max-width: 720px) {
        div {
            margin: 10px 5px;
        }
    }
</style>
