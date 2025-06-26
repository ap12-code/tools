<script lang="ts">
    import { numberValidator, type Validator } from "$lib/types";

    interface Props {
        label?: string;
        oninput?: (() => any) | null;
        value?: number | null;
        placeholder?: string;
        validator?: Validator<number>;
        copyable?: boolean;
        error?: boolean;
        error_message?: string;
        max?: number;
        min?: number;
        read_only?: boolean;
    }

    let {
        label = "",
        oninput = null,
        value = $bindable(),
        placeholder = "",
        validator = numberValidator(),
        copyable = false,
        error = $bindable(false),
        error_message = $bindable(""),
        max,
        min,
        read_only = false,
    }: Props = $props();

    let labelId = $derived(createLabelId());

    function update() {
        if (value != null) {
            const result = validator(value);
            error = result.is_error();
            if (!error) {
                error_message = "";
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
    <label for={labelId}>{label}</label>
    <div class="input-field">
        {#if error_message}
            <span class="error-text">{error_message}</span>
        {/if}
        <input type="number" bind:value readonly={read_only} {placeholder} id={labelId} {max} {min} class:error oninput={update} />
    </div>
    {#if copyable}
        <button onclick={copy}>コピー</button>
    {/if}
</div>

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
        margin: 5px 0;
    }
    label {
        width: 200px;
    }
    .input-field {
        flex-grow: 1;
        position: relative;
    }
    .error-text {
        position: absolute;
        right: 0px;
        line-height: 1.3;
        font-size: 0.75rem;
        padding: 5px 10px;
        z-index: 10;
    }
</style>
