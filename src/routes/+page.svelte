<script>
    import Container from "$components/Container.svelte";
    import { tools } from "$lib/tools.json";
</script>

<div>
    <Container show_back={false}>
        <div>
            <img src="/toolbox-logo.png" alt="AP12's ToolBox" />
            <div class="header">
                <a href="/information">バージョン情報</a>
                <a href="/terms">利用規約</a>
                <a href="/privacy">プライバシーポリシー</a>
            </div>
        </div>
        <hr />
        <div>
            {#each tools as d, i}
                <p>{d.name}</p>
                <div class="tools">
                    {#each d.tools as t}
                        <div style="border-left: 10px {d.color} solid;" class="tool mg-right">
                            <a href={t.href}>
                                <i class="bi bi-{t.icon}"></i>
                                {t.name}
                            </a>
                        </div>
                    {/each}
                    <div></div>
                    <div></div>
                </div>
            {/each}
        </div>
    </Container>
</div>

<style>
    .tools {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(320px, 320px));
    }
    .tool {
        border: #666 1px solid;
        border-radius: 5px;
    }

    .tool a {
        padding: 10px 20px;
        text-decoration: none;
        color: #fff;
        display: block;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
    img {
        height: 100px;
    }
    .header {
        display: flex;
        margin: 20px 0;
        gap: 10px;
    }
    .header a {
        color: #fff;
    }
</style>
