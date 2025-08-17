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
            <span class="icon fill">arrow_left</span>{back_to == "/" ? "ホームに戻る" : "戻る"}
        </a>
    {/if}
    {@render children?.()}
</div>

<style>
    .back {
        color: #fff;
        text-decoration: none;
    }
    @media (max-width: 1025px) {
        .container {
            margin: 10px 15px;
        }
    }
    @media (max-width: 720px) {
        .container {
            margin: 10px 5px;
        }
    }
    @media (min-width: 1025px) {
        .container {
            margin: 20px 100px;
        }
    }
</style>
