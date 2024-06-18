<script lang="ts">
    export let show_back = true;
</script>

<div>
    {#if show_back}
        <a class="back" href="/">
            <i class="bi bi-chevron-left"></i>ホームに戻る
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
