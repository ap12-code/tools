<script>
  import Container from "$components/Container.svelte";

</script>
<div>
    <Container>
        <h1>マイクラコマンド研究所's ToolBox</h1>
        <p>なにかに使えそうなツールを作ってます</p>
        <div>
            <hr />
            <div class="tools">
                <span>生成ツール</span>
                <a class="tool" href="/other/uuid" style="border-left: 10px solid #993;">
                    <span class="tool-title">UUID</span>
                </a>
            </div>
            <hr />
            <div class="tools">
                <span>変換ツール</span>
                <a class="tool" href="/other/bases" style="border-left: 10px solid #393;">
                    <span class="tool-title">基数</span>
                </a>
            </div>
            <hr />
            <div class="tools">
                <span>エンコーダー/デコーダー</span>
                <a class="tool" href="/other/base64" style="border-left: 10px solid #55b;">
                    <span class="tool-title">Base64</span>
                </a>
                <a class="tool" href="/other/url" style="border-left: 10px solid #55b;">
                    <span class="tool-title">URL</span>
                </a>
                <a class="tool" href="/other/unicode" style="border-left: 10px solid #55b;">
                    <span class="tool-title">Unicodeエスケープシーケンス</span>
                </a>
            </div>
            <hr />
            <p>あとで増えますYo</p>
        </div>
    </Container>
</div>

<style>
    .tools {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        flex-direction: column;
    }
    .tool {
        border: #666 1px solid;
        border-radius: 5px;
        padding: 10px 20px;
        text-decoration: none;
        color: #fff;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>