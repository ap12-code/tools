<script lang="ts">
    import { numberValidator, type Validator } from '$lib/validator';

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
        id?: string;
    }

    let {
        label = '',
        oninput = null,
        value = $bindable(),
        placeholder = '',
        validator = numberValidator(),
        copyable = false,
        error = $bindable(false),
        error_message = $bindable(''),
        max,
        min,
        read_only = false,
        id = ''
    }: Props = $props();

    function createLabelId(): string {
        return id || `label__${Math.floor(Math.random() * 100000)}`;
    }
    let labelId = $derived(createLabelId());
</script>

<div>
    <label for={labelId}>{label}</label>
    <input class="input" id={labelId} type="range" />
</div>

<style>
    div {
        display: flex;
        gap: 5px;
    }
    label {
        width: 200px;
    }
    .input {
        appearance: none;
        width: 100%;
        background-color: transparent;
    }
    .input::-webkit-slider-runnable-track {
        appearance: none;
        height: 10px;
        background-color: #666;
        border-radius: 5px;
    }
    .input::-webkit-slider-thumb {
        appearance: none;
        background-color: #fff;
        border-radius: 5px;
        height: 20px;
        width: 20px;
        margin-top: -5px;
    }
</style>
