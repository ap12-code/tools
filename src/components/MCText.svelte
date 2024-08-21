<script lang="ts">
    import Button from "$components/Button.svelte"
    let data: TextObject[] = [];
    let serialized: string = ""

    function onInput() {
        serialized = JSON.stringify(convertData())
    }
    function convertData(): TextObject[] {
        const element =  document.getElementById("textd")
        if (!element) return []
        const result: TextObject[] = []
        Array.from(element.childNodes).forEach(elm => {
            result.push({
                text: element.textContent || ""
            })
        });

        return result
    }
</script>

<div>
    <div class="toolbar">
        <Button><i class="bi bi-type-bold"></i></Button>
        <Button><i class="bi bi-type-italic"></i></Button>
        <Button><i class="bi bi-type-strikethrough"></i></Button>
        <Button><i class="bi bi-type-underline"></i></Button>
    </div>
    <div contenteditable="true" role="textbox" spellcheck="true" class="main" on:change={onInput}>
        <p class="editor-paragraph ltr" dir="ltr" id="textd">

        </p>
    </div>
    <pre>
        {data}
    </pre>
</div>

<style>
    .toolbar {
        display: flex;
        gap: 2px;
    }
    .main {
        user-select: text;
        white-space: pre-wrap;
        word-break: break-word;
        padding: 2px;
        font-size: 14px;
        width: 50vw;

    }
    .editor-paragraph {
        color: #fff;
    }
</style>