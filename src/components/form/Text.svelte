<script lang="ts" generics="T">
    import type { Validator } from '$lib/validator';

    interface Props {
        label?: string;
        oninput?: (() => any) | null;
        value?: T;
        placeholder?: string;
        validator?: Validator<T> | null;
        copyable?: boolean;
        error?: boolean;
        error_message?: string;
        read_only?: boolean;
    }

    let {
        label = '',
        oninput = null,
        value = $bindable(),
        placeholder = '',
        validator = null,
        copyable = false,
        error = $bindable(false),
        error_message = $bindable(''),
        read_only = false
    }: Props = $props();

    let labelId = $derived(createLabelId());

    function update() {
        if (validator && value) {
            const result = validator(value);
            error = result.is_error();
            if (!error) {
                error_message = '';
                if (oninput) oninput();
            } else {
                error_message = result.get_error().message;
            }
        }
    }

    function copy() {
        if (!error && value) {
            navigator.clipboard.writeText(value.toString());
        }
    }

    function createLabelId(): string {
        return `label__${Math.floor(Math.random() * 100000)}`;
    }
</script>

<div>
    {#if label}
        <label for={labelId}>{label}</label>
    {/if}
    <input readonly={read_only} type="text" bind:value {placeholder} id={labelId} class:error oninput={update} />
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
        font-family: 'Zen Maru Gothic', serif;
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
        margin: 5px 0;
    }
    label {
        width: 200px;
    }
</style>
