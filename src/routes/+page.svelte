<script>
    import Container from "$components/Container.svelte";
</script>

<div>
    <Container>
        <h1>マイクラコマンド研究所's ToolBox</h1>
        <p>なにかに使えそうなツールをいろいろ作ってます。要望あればdiscordまで。</p>
        <hr />
        <div>
            <div class="tools">
                <span>生成ツール</span>
                <a class="tool" href="/tool/random" style="border-left: 10px solid #993;">
                    <span class="tool-title">ランダム数</span>
                </a>
                <a class="tool" href="/tool/password" style="border-left: 10px solid #993;">
                    <span class="tool-title">パスワード</span>
                </a>
                <a class="tool" href="/tool/uuid" style="border-left: 10px solid #993;">
                    <span class="tool-title">UUID</span>
                </a>
                <a class="tool" href="/tool/pack-mcmeta" style="border-left: 10px solid #993;">
                    <span class="tool-title">pack.mcmeta</span>
                </a>
                <a class="tool" href="/tool/manifests" style="border-left: 10px solid #993;">
                    <span class="tool-title">manifest.json</span>
                </a>
                <a class="tool" href="/tool/qrcode" style="border-left: 10px solid #993;">
                    <span class="tool-title">QRコード</span>
                </a>
            </div>
            <hr />
            <div class="tools">
                <span>ネットワークツール</span>
                <a class="tool" href="/tool/ip" style="border-left: 10px solid #939;">
                    <span class="tool-title">IPチェッカー</span>
                </a>
                <a class="tool" href="/tool/lookup" style="border-left: 10px solid #939;">
                    <span class="tool-title">dig / nslookup</span>
                </a>
                <a class="tool" href="/tool/whois" style="border-left: 10px solid #939;">
                    <span class="tool-title">whois</span>
                </a>
                <a class="tool" href="/tool/ping" style="border-left: 10px solid #939;">
                    <span class="tool-title">Ping</span>
                </a>
                <a class="tool" href="/tool/mcsrvstat" style="border-left: 10px solid #939;">
                    <span class="tool-title">MCサーバーステータス</span>
                </a>
            </div>
            <hr />
            <div class="tools">
                <span>変換ツール</span>
                <a class="tool" href="/tool/bases" style="border-left: 10px solid #393;">
                    <span class="tool-title">基数</span>
                </a>
                <a class="tool" href="/tool/upper-lower" style="border-left: 10px solid #393;">
                    <span class="tool-title">大文字/小文字</span>
                </a>
                <a class="tool" href="/tool/unix-timestamp" style="border-left: 10px solid #393;">
                    <span class="tool-title">Unix Timestamp</span>
                </a>
                <a class="tool" href="/tool/image" style="border-left: 10px solid #393;">
                    <span class="tool-title">画像形式変換</span>
                </a>
            </div>
            <hr />
            <div class="tools">
                <span>エンコーダー/デコーダー</span>
                <a class="tool" href="/tool/base64" style="border-left: 10px solid #55b;">
                    <span class="tool-title">Base64 (文字)</span>
                </a>
                <a class="tool" href="/tool/url" style="border-left: 10px solid #55b;">
                    <span class="tool-title">URL</span>
                </a>
                <a class="tool" href="/tool/unicode" style="border-left: 10px solid #55b;">
                    <span class="tool-title">Unicodeエスケープシーケンス</span>
                </a>
                <a class="tool" href="/tool/html" style="border-left: 10px solid #55b;">
                    <span class="tool-title">HTML</span>
                </a>
            </div>
            <hr />
            <div class="tools">
                <span>その他</span>
                <a class="tool" href="/tool/text-counter" style="border-left: 10px solid #5bb;">
                    <span class="tool-title">文字数カウンタ</span>
                </a>
                <a class="tool" href="/tool/counter" style="border-left: 10px solid #5bb;">
                    <span class="tool-title">カウンタ</span>
                </a>
                <a class="tool" href="/tool/clock" style="border-left: 10px solid #5bb;">
                    <span class="tool-title">時計</span>
                </a>
                <a class="tool" href="/tool/stopwatch" style="border-left: 10px solid #5bb;">
                    <span class="tool-title">ストップウォッチ</span>
                </a>
            </div>
            <hr />
            <p>あとでもっと増えますYo</p>
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
