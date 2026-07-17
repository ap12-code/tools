<script lang="ts">
    interface Props {
        name?: string;
        value?: boolean;
        oninput?: () => any;
    }

    let { name = '', value = $bindable(false), oninput = () => {} }: Props = $props();

    function update() {
        oninput();
    }
</script>

<div class="toggle-wrapper">
    <label class="toggle-button">
        <input type="checkbox" bind:checked={value} onchange={update} />
    </label>
    <span class="toggle-name">{name}</span>
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
