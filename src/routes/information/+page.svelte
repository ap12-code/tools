<script lang="ts">
    import Container from '$components/Container.svelte';
</script>

<Container>
    <h1>バージョン更新情報</h1>
    <hr />
    <h2>更新履歴</h2>
    <div class="version">
        <h3>v1.5.2 (現行)</h3>
        <p>バグ修正</p>
        <ul>
            <li>(Minecraft)テキストジェネレータのバグを修正</li>
            <li>(Minecraft)テキストジェネレータのバグを修正</li>
        </ul>
    </div>
    <div class="version">
        <h3>v1.5.1</h3>
        <p>パスワードジェネレータへの新機能追加とバグ修正</p>
        <ul>
            <li>(パスワードジェネレータ)自動で再生成するかのスイッチを追加</li>
            <li>(パスワードジェネレータ)チェックボックスの表示に関する不具合を修正</li>
            <li>(パスワードジェネレータ)セキュリティ上の理由からcryptoを使用するように</li>
        </ul>
    </div>
    <div class="version">
        <h3>v1.5.0</h3>
        <p>大幅アップデート</p>
        <ul>
            <li>カテゴリを整理</li>
            <li>漢数字変換を追加</li>
            <li>プライバシーポリシーを更新</li>
            <li>(単位換算)質量換算を追加</li>
            <li>(Minecraft)テキストジェネレーターを追加</li>
            <li>時計のAPIサービスを変更</li>
            <li>UIアイコンを変更</li>
            <li>(Minecraft)コマンドジェネレーターの対応バージョンを1.21.8へ更新</li>
            <li>その他バグ修正</li>
        </ul>
    </div>
    <div class="version">
        <h3>v1.4.0</h3>
        <p>新機能を追加/バグ修正</p>
        <ul>
            <li>Minecraftのカテゴリを分離</li>
            <li>(Minecraft)コマンドジェネレーターを追加</li>
            <li>(Minecraft)スタック換算を追加</li>
            <li>JSONのフォーマッターとマージャーを追加</li>
            <li>Base64で日本語を変換できない問題を修正</li>
            <li>文字数カウンタで絵文字等を正確にカウントできない問題を修正</li>
            <li>その他一部バグ修正</li>
        </ul>
    </div>
    <div class="version">
        <h3>v1.3.0</h3>
        <p>新機能を追加/バグ修正</p>
        <ul>
            <li>換算機能に距離と為替を追加</li>
            <li>一部機能のバグ修正</li>
            <li>ロゴを追加</li>
        </ul>
    </div>
    <div class="version">
        <h3>v1.2.0</h3>
        <p>新機能を追加/バグ修正</p>
        <ul>
            <li>電卓機能を追加</li>
            <li>換算機能を追加</li>
            <li>利用規約とプライバシーポリシーを追加</li>
            <li>画像形式変換を複数ファイル同時に行えるように変更</li>
            <li>一部機能のバグ修正</li>
        </ul>
    </div>
    <div class="version">
        <h3>v1.1.0</h3>
        <p>新機能を追加</p>
        <ul>
            <li>カラーピッカーを追加</li>
            <li>数式計算機を追加</li>
        </ul>
    </div>
    <div class="version">
        <h3>v1.0.0</h3>
        <p>初期バージョンリリース</p>
    </div>
</Container>

<style>
    h2 {
        margin: 10px 0;
    }
    .version > h3 {
        font-family: 'Noto Sans';
        margin: 0;
    }
    .version > p {
        margin: 0;
    }
    .version > ul {
        margin: 10px 0;
    }
    .version {
        margin-left: 10px;
        margin-bottom: 50px;
    }
</style>
