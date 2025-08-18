<script lang="ts">
    import Container from '$components/Container.svelte';
    import { page } from '$app/state';
</script>

<Container show_back={false}>
    <h1>申し訳ございません。エラーが発生しました</h1>
    <span>エラーコード: {page.status}</span>
    <hr />
    <p>
        {page.error?.message}
    </p>
    <a href="/">ホームに戻る</a>
</Container>

<style>
    p {
        padding: 10px;
        border-radius: 10px;
        background-color: #111;
    }
    a {
        color: #fff;
    }
</style>
