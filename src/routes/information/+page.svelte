<script lang="ts">
    import Container from "$components/Container.svelte";
</script>

<Container>
    <h1>Version 1.1.0</h1>
    <hr />
    <h1>更新履歴</h1>
    <div>
        <div>
            <span>2024/06/21 Version 1.1.0</span><br />
            <span>
                新機能を追加<br />
                <ul>
                    <li>カラーピッカー</li>
                    <li>数式計算機</li>
                </ul>
            </span>
        </div>
        <hr />
        <div>
            <span>2024/06/19 Version 1.0.0</span><br />
            <span>初期リリースバージョン。β時点に存在していた24機能が実装済み</span>
        </div>
    </div>
</Container>

<style>
    div {
        margin: 20px;
    }
</style>
