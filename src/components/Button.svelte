<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children: Snippet;
        onclick?: () => void;
        disabled?: boolean;
        inline?: boolean;
        style?: ButtonStyle;
        fontSize?: number;
    }

    const styledBorders = {
        default: '#666',
        green: '#6b6',
        red: '#b66',
        white: '#bbb'
    };
    type ButtonStyle = keyof typeof styledBorders;

    let { children, onclick, disabled, inline = false, style = 'default', fontSize = 15 }: Props = $props();
</script>

<button
    {onclick}
    {disabled}
    class="button-component"
    style:border-color={styledBorders[style]}
    style:fontSize={fontSize + 'px'}
    style:width={!inline ? '100%' : '200px'}
>
    {@render children?.()}
</button>

<style>
    button {
        padding: 5px;
        background-color: #222;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 32px;
        transition: 0.2s all;
    }
    button :global(svg) {
        width: 18px;
        height: 18px;
    }
    button:hover {
        background-color: #666;
    }
    button:disabled {
        background-color: #444;
    }
</style>
