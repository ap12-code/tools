<script>
    import Container from '$components/Container.svelte';
    import { tools } from '$lib/tools.json';
</script>

<Container show_back={false}>
    <div class="home">
        <div>
            <img src="/toolbox-logo.png" class="logo" alt="AP12's ToolBox" />
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
                                <span class="icon fill">{t.icon}</span>
                                <span>{t.name}</span>
                            </a>
                        </div>
                    {/each}
                    <div></div>
                    <div></div>
                </div>
            {/each}
        </div>
    </div>
</Container>

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

    @media (max-width: 720px) {
        .tools {
            display: grid;
            gap: 10px;
            grid-template-columns: 1fr;
        }
        .home {
            padding-top: 10px;
            margin: 0 10px;
        }
        .header {
            justify-content: center;
        }
        .logo {
            display: block;
            margin: 0 auto;
        }
    }
</style>
