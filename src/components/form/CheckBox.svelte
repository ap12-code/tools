<script lang="ts">
    interface Props {
        checked?: boolean;
        onchange?: () => void;
        disabled?: boolean;
        label?: string;
        id?: string;
    }

    let { checked = $bindable(false), onchange = () => {}, label = '', disabled = false, id }: Props = $props();

    function createLabelId(): string {
        return `checkbox__${Math.floor(Math.random() * 100000)}`;
    }

    const labelId = $derived(id || createLabelId());
</script>

<div class="checks">
    <input bind:checked {onchange} {disabled} type="checkbox" class="checkbox" id={labelId} />
    <label for={labelId}>{label}</label>
</div>

<style>
    .checks {
        display: inline-flex;
        align-items: center;
        height: 24px;
    }
    .checks label {
        cursor: pointer;
        user-select: none;
        -moz-user-select: none;
    }
    .checkbox {
        cursor: pointer;
        appearance: none;
        position: relative;
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
        display: inline-block;
        position: absolute;
        color: #000;
        height: 24px;
        width: 18px;
        padding: 2px;
        vertical-align: -0.125em;
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z'/%3E%3C/svg%3E");
    }
    .checkbox:focus-visible {
        outline: none;
    }
</style>
