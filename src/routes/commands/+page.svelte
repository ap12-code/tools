<script>
    import Container from "$components/Container.svelte";
    import { commands } from "$lib/commands.json";
</script>

<div>
    <Container>
        <h1>コマンドジェネレーター</h1>
        <hr />
        <div class="tools">
            {#each commands as d, i}
                <div style="border-left: 10px {d.color} solid;" class="tool mg-right">
                    <a href={d.path}>
                        {d.name}
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
