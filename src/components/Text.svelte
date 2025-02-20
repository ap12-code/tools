<script lang="ts">
    interface Props {
        value?: string;
        err?: boolean;
        readonly?: boolean;
    }

    let { value = $bindable(""), err = false, readonly = true }: Props = $props();

    function copy() {
        navigator.clipboard.writeText(value)
    }
</script>

<div>
    <textarea bind:value={value} readonly={readonly} class:err={err}></textarea>
    <button onclick={copy}>コピー</button>
</div>

<style>
    .err {
        border-color: #d00;
    }
    textarea {
        flex: 1 1;
        padding: 5px;
        background-color: #222;
        resize: none;
        align-content: center;
        border-radius: 5px;
        color: #fff;
    }
    button {
        padding: 5px 10px;
        background-color: #222;

        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        transition: 0.2s all;
    }
    button:hover {
        background-color: #666;
        transition: 0.2s all;
        cursor: pointer;
    }
    div {
        gap: 10px;
        display: flex;
        margin: 10px 0;
    }
</style>