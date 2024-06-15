<script lang="ts">
    import Container from "$components/Container.svelte";
    import { onMount } from "svelte";

    $: data = {
        "ip": "取得中...",
        "hostname": "取得中...",
        "city": "取得中...",
        "region": "取得中...",
        "country": "取得中...",
        "loc": "取得中...",
        "org": "取得中...",
        "postal": "取得中...",
        "timezone": "取得中...",
        "readme": "取得中..."
    }
    onMount(async () => {
        data = await (await fetch("https://ipinfo.io?callback")).json()
        console.log(data)
    })
</script>
<Container>
    <h1>IPチェッカー</h1>
    <hr />
    <span>グローバルIPアドレス</span>
    <textarea readonly>{data.ip}</textarea>
    <hr />
    <span>国</span>
    <textarea readonly>{data.country}</textarea>
    <span>県</span>
    <textarea readonly>{data.region}</textarea>
    <span>市</span>
    <textarea readonly>{data.city}</textarea>
    <hr />
    <span>プロバイダ</span>
    <textarea readonly>{data.org}</textarea>
    <hr />
    <p>Data Provided by ipinfo.io</p>
</Container>

<style>
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        align-content: center;
        border-radius: 5px;
        color: #fff;
    }
</style>