<script lang="ts">
    import { Color } from '$lib/color.svelte';
    import { onMount } from 'svelte';

    let color = $state(new Color());
    let color_gradient = $state('');
    let alpha_gradient = $state('');
    let mode = $state('hsl');

    let drag_hue = $state(false);

    let pos_x = $state(100);
    let pos_y = $state(100);
    let drag_sl = $state(false);

    let element: HTMLDivElement;
    let sl_indicator_element: HTMLDivElement | null = $state(null);
    let hue_indicator_element: HTMLDivElement | null = $state(null);

    const alpha_bg =
        'linear-gradient(45deg, #eee 25%, #0000 25%, #0000 75%, #eee 75%) 0 0 / 10px 10px, linear-gradient(45deg, #eee 25%, #0000 25%, #0000 75%, #eee 75%) 5px 5px / 10px 10px';
    const rainbow =
        'linear-gradient(90deg, #ff1500fb, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%, #0000ff 67.7%, #ff00ff 83.3%, #ff0000)';

    function update() {
        alpha_gradient = `linear-gradient(90deg, rgba(0, 0, 0, 0), #${color.hex}), ${alpha_bg}`;
        color_gradient = `linear-gradient(#fff0, #000), linear-gradient(.25turn, #fff, #0000), hsl(${color.h}deg, 100%, 50%)`;

        if (!sl_indicator_element) return;
        if (!hue_indicator_element) return;

        hue_indicator_element.style.left = `${fix_thumb_position(color.h, 360) - 1}px`;
        sl_indicator_element.style.left = `${fix_thumb_position(pos_x)}px`;
        sl_indicator_element.style.top = `${fix_thumb_position(pos_y)}px`;
        document.getSelection()?.removeAllRanges();
    }

    const PICKER_SIZE = 200;
    const PICKER_PADDING = 4;

    const THUMB_SIZE = 10;

    function remap(v: number, in_min: number, in_max: number, out_min: number, out_max: number) {
        return out_min + ((v - in_min) / (in_max - in_min)) * (out_max - out_min);
    }

    function fix_thumb_position(v: number, max: number = 100) {
        return (v * (PICKER_SIZE - THUMB_SIZE - PICKER_PADDING)) / max + PICKER_PADDING / 2;
    }

    function on_mouse_event(ev: MouseEvent) {
        const rect = document.getElementById('picker')?.getBoundingClientRect();
        if (!rect) return;

        let saturation_v = ev.pageX - rect.left;
        if (saturation_v > rect.width) saturation_v = rect.width;
        if (saturation_v < 0) saturation_v = 0;

        let lightness_v = ev.pageY - rect.top;
        if (lightness_v > rect.height) lightness_v = rect.height;
        if (lightness_v < 0) lightness_v = 0;

        pos_x = remap(saturation_v, 0, rect.width, 0, 100);
        pos_y = remap(lightness_v, 0, rect.height, 0, 100);
        color.s = pos_x / 100;
        color.v = ((1 - pos_y / 100) * (100 - 0.5 * pos_x)) / 100;
        
        update()
    }

    function register_listeners(move: (ev: MouseEvent) => any, up: (ev: MouseEvent) => any) {
        console.log("debug: register listeners")
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
        document.addEventListener('dragend', up);
    }

    function unregister_listeners(move: (ev: MouseEvent) => any, up: (ev: MouseEvent) => any) {
        console.log("debug: unregister listeners")
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        document.removeEventListener('dragend', up);
    }

    function thumb_on_mouse_down(ev: MouseEvent) {
        on_mouse_event(ev);
        drag_sl = true;
        register_listeners(thumb_on_mouse_move, thumb_on_mouse_up);
    }
    function thumb_on_mouse_up() {
        drag_sl = false;
        unregister_listeners(thumb_on_mouse_move, thumb_on_mouse_up);
    }

    function thumb_on_mouse_move(ev: MouseEvent) {
        if (!drag_sl) return;
        on_mouse_event(ev);
    }

    function hue_mouse_down(ev: MouseEvent) {
        const rect = document.querySelector('.track')?.getBoundingClientRect();
        if (!rect) return;
        drag_hue = true;
        color.h = remap(ev.pageX - rect.left, 0, rect.width, 0, 360);
        register_listeners(hue_mouse_move, hue_mouse_up)
    }

    function hue_mouse_up() {
        drag_hue = false;
        unregister_listeners(hue_mouse_move, hue_mouse_up)
    }

    function hue_mouse_move(ev: MouseEvent) {
        if (!drag_hue) return;
        const rect = document.querySelector('.track')?.getBoundingClientRect();
        if (!rect) return;

        let hue_v = ev.pageX - rect.left;
        if (hue_v > rect.width) hue_v = rect.width;
        if (hue_v < 0) hue_v = 0;
        color.h = remap(hue_v, 0, rect.width, 0, 360);

        update()
    }

    onMount(() => {
        element.style.setProperty('--picker-size', `${PICKER_SIZE}px`);
        element.style.setProperty('--picker-padding', `${PICKER_PADDING}px`);
        element.style.setProperty('--picker-indicator-size', `${THUMB_SIZE}px`);


    });
</script>

<div class="picker-root">
    <div class="picker-inner" bind:this={element}>
        <div class="picker-colors">
            {#if mode == 'hsl'}
                <div class="picker">
                    <div
                        id="picker"
                        role="slider"
                        tabindex="-1"
                        style:background={color_gradient}
                        onmousedown={thumb_on_mouse_down}
                        aria-valuenow={pos_x}
                        class="picker-color"
                    >
                        <div class="thumb" bind:this={sl_indicator_element}></div>
                    </div>
                    <div style:background={rainbow} role="slider" tabindex="-1" aria-valuenow={color.h} onmousedown={hue_mouse_down} class="track">
                        <div class="track-indicator" bind:this={hue_indicator_element}></div>
                    </div>
                    <div style:background={alpha_gradient} class="track"></div>
                </div>
            {:else if mode == 'rgb'}
                <div class="picker">
                    <div style:background={color_gradient} class="color"></div>
                    <div style:background={rainbow} class="track"></div>
                    <div style:background={alpha_gradient} class="track"></div>
                </div>
            {/if}
        </div>
    </div>
    <div>
        <div class="picker-preview">
            <div class="picker-preview-color" style:background={`#${color}`}></div>
            <div class="picker-preview-color" style:background={`#${color}`}></div>
        </div>
        <div class="picker-inputs">
            <div class="hsl props">
                <div>
                    <label for="hue">H</label>
                    <input id="hue" type="number" bind:value={color.h} max="360" min="0" />
                </div>
                <div>
                    <label for="saturation">S</label>
                    <input id="saturation" type="number" bind:value={color.s} max="100" min="0" />
                </div>
                <div>
                    <label for="lightness">L</label>
                    <input id="lightness" type="number" bind:value={color.v} max="100" min="0" />
                </div>
            </div>
            <hr />
            <div class="rgb props">
                <div>
                    <label for="red">R</label>
                    <input id="red" type="number" bind:value={color.r} max="255" min="0" />
                </div>
                <div>
                    <label for="green">G</label>
                    <input id="green" type="number" bind:value={color.g} max="255" min="0" />
                </div>
                <div>
                    <label for="blue">B</label>
                    <input id="blue" type="number" bind:value={color.b} max="255" min="0" />
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .picker-root {
        display: flex;
        gap: 5px;
    }
    .picker-inner {
        display: flex;
        flex-direction: column;
        gap: 5px;
        max-width: var(--picker-size);
    }
    hr {
        margin: 5px;
    }
    .picker {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 5px;
    }

    .picker-color {
        position: relative;
        width: var(--picker-size);
        height: var(--picker-size);
        border-radius: 3px;
    }

    .track {
        position: relative;
        height: 10px;
        width: 200px;
        border-radius: 3px;
    }
    .thumb {
        position: absolute;

        height: var(--picker-indicator-size);
        width: var(--picker-indicator-size);

        border: 1px solid #000;
        box-shadow: 0 0 0 1px #fff;
        border-radius: 5px;
    }

    .track-indicator {
        position: absolute;
        width: 10px;
        height: 10px;
        top: -1px;
        border-radius: 2px;
        border: 1px solid #000;
        box-shadow: 0 0 0 1px #fff;
    }

    .picker-inputs > .props {
        display: grid;
        gap: 5px;
        user-select: none;
    }
    .picker-inputs > .props div {
        display: flex;
        align-items: center;
    }
    .picker-inputs > .props div > label {
        padding: 0 2px;
        vertical-align: -2px;
        font-weight: bold;
    }
    .picker-inputs > .props div > input {
        flex-grow: 1;
        padding: 2px;
        border-radius: 3px;
        border: 1px solid #666;
        background-color: #111;
        color: #fff;
    }

    .picker-preview-color {
        width: 100%;
        height: 25px;
        border-radius: 3px;
        margin-bottom: 2px;
    }
</style>
