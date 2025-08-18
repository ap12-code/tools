<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    interface Props {
        name?: string;
        value?: boolean;
    }

    let { name = '', value = $bindable(false) }: Props = $props();

    const dispatch = createEventDispatcher();
    function update() {
        dispatch('input');
    }
</script>

<div class="toggleWapper">
    <label class="toggle-button">
        {name}
        <input type="checkbox" bind:checked={value} onchange={update} />
    </label>
</div>

<style>
    .toggle-button {
        display: inline-block;
        position: relative;
        width: 50px;
        height: 22px;
        border-radius: 20px;
        border: 2px solid #666;
        box-sizing: content-box;
        cursor: pointer;
        transition: border-color 0.4s;
    }

    .toggle-button:has(:global(:checked)) {
        border-color: #6f6;
    }

    .toggle-button::after {
        position: absolute;
        top: 50%;
        left: 2px;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #666;
        content: '';
        transition: left 0.4s;
    }

    .toggle-button:has(:global(:checked))::after {
        left: 28px;
        background-color: #6f6;
    }

    .toggle-button input {
        display: none;
    }
</style>
