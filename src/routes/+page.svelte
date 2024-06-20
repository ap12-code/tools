<script>
    import Container from "$components/Container.svelte";
    import { tools } from "$lib/tools.json";
</script>

<div>
    <Container show_back={false}>
        <h1>AP12's ToolBox</h1>
        <p>なにかに使えそうないろいろなツール群。</p>
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
    a {
        padding: 10px 20px;
        text-decoration: none;
        color: #fff;
        display: block;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
