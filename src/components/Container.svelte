<script lang="ts">
    interface Props {
        show_back?: boolean;
        back_to?: string;
        children?: import('svelte').Snippet;
    }

    let { show_back = true, back_to = "/", children }: Props = $props();
</script>

<div>
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
    div {
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
