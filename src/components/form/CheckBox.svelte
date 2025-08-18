<script lang="ts">
    interface Props {
        checked: boolean;
        onchange: () => void;
        disabled?: boolean;
        label?: string;
    }

    let { checked = $bindable(false), onchange = () => {}, label = '', disabled = false }: Props = $props();

    function createLabelId(): string {
        return `checkbox__${Math.floor(Math.random() * 100000)}`;
    }

    const labelId = $derived(createLabelId());
</script>

<div class="checks">
    <input bind:checked {onchange} {disabled} type="checkbox" class="checkbox" id={labelId} />
    <label for={labelId}>{label}</label>
</div>

<style>
    .checks {
        display: flex;
        align-items: center;
    }
    .checks label {
        cursor: pointer;
    }
    .checkbox {
        cursor: pointer;
        appearance: none;
        height: 24px;
        width: 24px;
        margin: 4px;
        border: 1px solid #8b98a5;
        border-radius: 4px;
    }
    .checkbox:checked {
        border: 1px solid #8b98a5;
        background-color: #fff;
    }
    .checkbox:checked::before {
        display: grid;
        place-content: center;
        color: #000;
        height: 100%;
        font-family: 'Material Symbols Rounded';
        font-variation-settings:
            'FILL' 1,
            'wght' 300,
            'GRAD' 0,
            'opsz' 24;
        font-size: 18px;
        content: '\e5ca';
    }
    .checkbox:focus-visible {
        outline: none;
    }
</style>
