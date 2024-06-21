<script lang="ts">
    export let show_back = true;
    export let back_to = "/";
</script>

<div>
    {#if show_back}
        <a class="back" href={back_to}>
            <i class="bi bi-chevron-left"></i>{back_to == "/" ? "ホームに戻る" : "戻る"}
        </a>
    {/if}
    <slot></slot>
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
