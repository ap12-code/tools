<script lang="ts">
    import Container from "$components/Container.svelte";
    import nerdamer from "nerdamer-prime";
    import katex from "katex";
    import "katex/dist/katex.css";
    import Button from "$components/Button.svelte";

    let plain = $state("");
    let output: nerdamer.Expression | null = $state(null);
    let out2 = "";

    function update() {
        nerdamer.clearVars();
        output = nerdamer(plain);
        const element = document.getElementById("math");
        if (!element) return;
        katex.render(nerdamer.convertToLaTeX(plain), element, {
            throwOnError: false,
        });
    }

    function solve() {
        if (!output) return;
        const element = document.getElementById("math");
        if (!element) return;
        output = output.evaluate();
        plain = output.text();
    }
</script>

<Container>
    <h1>数式計算機</h1>
    <hr />
    <div class="main">
        <span id="math"></span>
        <div>
            <textarea bind:value={plain} oninput={update}></textarea>
        </div>
        {#if output}
            <Button on:click={() => solve()}>=</Button>
        {/if}
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
        height: 20vh;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
