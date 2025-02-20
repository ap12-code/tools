<script lang="ts">
    import type { ActionResult } from "$lib/types";
    import { createEventDispatcher } from "svelte";

    export let value = ""
    export let placeholder = ""

    type Validator<T> = (val: string) => ActionResult<T>
    export let validator: Validator<any> | null = null
    export let copyable = false
    export let error = false

    export let error_message = ""
    
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
    <input type="text" bind:value={value} {placeholder} class:error={error} on:input={update}>
    {#if copyable}
        <button on:click={copy}>コピー</button>
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