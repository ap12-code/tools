<script lang="ts">
    import type { ActionResult } from "$lib/types";
    import { createEventDispatcher } from "svelte";


    type Validator<T> = (val: string) => ActionResult<T>

    interface Props {
        value?: string;
        placeholder?: string;
        validator?: Validator<any> | null;
        copyable?: boolean;
        error?: boolean;
        error_message?: string;
    }

    let {
        value = $bindable(""),
        placeholder = "",
        validator = null,
        copyable = false,
        error = $bindable(false),
        error_message = $bindable("")
    }: Props = $props();
    
    const dispatch = createEventDispatcher()

    function update() {
        if (validator) {
            const result = validator(value)
            error = result.is_error()
            if (!error) {
                error_message = ""
                dispatch("update")
            } else {
                error_message = result.get_error().message
            }
        }
    }

    function copy() {
        navigator.clipboard.writeText(value)
    }
</script>

<div>
    <input type="text" bind:value={value} {placeholder} class:error={error} oninput={update}>
    {#if copyable}
        <button onclick={copy}>コピー</button>
    {/if}
</div>
<span>{error_message}</span>

<style>
    .error {
        border-color: #d00;
    }
    input {
        flex: 1 1;
        padding: 5px;
        background-color: #222;
        resize: none;
        align-content: center;
        border-radius: 5px;
        color: #fff;
        font-family: "Zen Maru Gothic", serif;
        border: 1px #666 solid;
    }
    input:focus {
        outline: none;
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