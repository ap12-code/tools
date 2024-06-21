<script>
    import Container from "$components/Container.svelte";
    import { converters } from "$lib/converters.json";
</script>

<div>
    <Container>
        <h1>換算ツール</h1>
        <hr />
        <div class="tools">
            {#each converters as t}
                <div style="border-left: 10px #bb0 solid;" class="tool mg-right">
                    <a href={t.path}>
                        <i class="bi bi-{t.icon}"></i>
                        {t.name}
                    </a>
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
