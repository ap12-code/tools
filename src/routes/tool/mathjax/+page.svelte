<script lang="ts">
    import Container from "$components/Container.svelte";
    import katex from "katex";
    import "katex/dist/katex.css";
    import { onMount } from "svelte";
    import domtoimage from "dom-to-image";
    import Button from "$components/Button.svelte";

    let plain = $state("y = 2x");

    function update() {
        const element = document.getElementById("math");
        if (!element) return;
        katex.render(plain.replaceAll("\n", ""), element, {
            throwOnError: false,
            macros: {},
        });
    }
    function save() {
        const element = document.getElementById("math");
        if (!element) return;
        domtoimage.toBlob(element).then((blob) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "math.png";
            a.click();
        });
    }
    onMount(update);
</script>

<Container>
    <h1>数式表示</h1>
    <hr />
    <div class="main">
        <span id="math"></span>
        <div>
            <textarea bind:value={plain} oninput={update}></textarea>
        </div>
    </div>
    <Button on:click={save}>Save</Button>
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
