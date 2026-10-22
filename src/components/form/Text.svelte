<script lang="ts" generics="T">
    import { alwaysTrueValidator, type Validator } from '$lib/validator';

    type Props = {
        label?: string;
        oninput?: (() => any) | null;
        value?: T;
        placeholder?: string;
        validator?: Validator<T> | null;
        copyable?: boolean;
        error?: boolean;
        error_message?: string | null;
        read_only?: boolean;
        multiline?: boolean;
        height?: string;
    };

    let {
        label = '',
        oninput = null,
        value = $bindable(),
        placeholder = '',
        validator = alwaysTrueValidator(),
        copyable = false,
        error = $bindable(false),
        error_message = $bindable(''),
        height = '',
        read_only = false,
        multiline = false,
        ...restProps
    }: Props = $props();

    let labelId = $derived(createLabelId());

    function update() {
        if (validator && value !== undefined) {
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
    {#if multiline}
        <textarea style:height readonly={read_only} bind:value {placeholder} id={labelId} class:error oninput={update}></textarea>
    {:else}
        <input {...restProps} readonly={read_only} type="text" bind:value {placeholder} id={labelId} class:error oninput={update} />
    {/if}
    {#if copyable}
        <button onclick={copy}>コピー</button>
    {/if}
</div>
<span class="error-message">{error_message}</span>

<style>
    .error {
        border-color: #d33;
    }
    .error-message {
        color: #d77;
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
    textarea {
        flex: 1 1;
        padding: 5px;
        background-color: #222;
        resize: none;
        border-radius: 5px;
        color: #fff;
        font-family: 'Zen Maru Gothic', serif;
        border: 1px #666 solid;
    }
    input:focus,
    textarea:focus {
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
