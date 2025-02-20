<script lang="ts">
    import { run } from "svelte/legacy";

    import Container from "$components/Container.svelte";
    import Text from "$components/Text.svelte";
    import { onMount } from "svelte";

    let ipv4 = $state("取得中...");

    let ipv6 = $state("取得中...");

    type Data = {
        ipv4: string;
        ipv6: string;
        hostname: string;
        country: string;
        region: string;
        city: string;
        org: string;
        loc: string;
        postal: string;
        timezone: string;
        readme: string;
    };

    let data: Data = $state({
        ipv4: "取得中...",
        ipv6: "取得中...",
        hostname: "取得中...",
        city: "取得中...",
        region: "取得中...",
        country: "取得中...",
        loc: "取得中...",
        org: "取得中...",
        postal: "取得中...",
        timezone: "取得中...",
        readme: "取得中...",
    });
    onMount(async () => {
        data = await (await fetch("https://ipapi.co/json/")).json();
        ipv4 = await (await fetch("https://api.ipify.org/?format=text")).text();
        try {
            ipv6 = await (await fetch("https://api6.ipify.org/?format=text")).text();
        } catch {
            ipv6 = "不明またはなし";
        }
    });
</script>

<Container>
    <h1>IPチェッカー</h1>
    <hr />
    <span>IPアドレス (IPv4)</span>
    <Text readonly value={ipv4} />
    <span>IPアドレス (IPv6)</span>
    <Text readonly value={ipv6} />
    <hr />
    <span>国</span>
    <Text readonly value={data.country} />
    <span>県</span>
    <Text readonly value={data.region} />
    <span>市</span>
    <Text readonly value={data.city} />
    <hr />
    <span>プロバイダ</span>
    <Text readonly value={data.org} />
    <hr />
    <p>Data Provided by ipapi.co & ipify.org</p>
</Container>

<style>
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
