<script lang="ts">
    import { browser } from '$app/environment';
    import Button from '$components/Button.svelte';
    import Buttons from '$components/Buttons.svelte';
    import Container from '$components/Container.svelte';
    import Dialog from '$components/Dialog.svelte';
    import CheckBox from '$components/form/CheckBox.svelte';
    import { Color } from '$lib/color.svelte';
    import { onMount } from 'svelte';

    type Input = {
        name: string;
        color: Color;
        weight: number;
        hidden: boolean;
    };

    type Vec2 = {
        x: number;
        y: number;
    };

    let dataError = $state(false);
    let inputs: Input[] = $state([
        { name: 'A', color: Color.fromRGB(0, 0, 0), weight: 1, hidden: false },
        { name: 'B', color: Color.fromRGB(0, 0, 0), weight: 1, hidden: false },
        { name: 'C', color: Color.fromRGB(0, 0, 0), weight: 1, hidden: false },
        { name: 'D', color: Color.fromRGB(0, 0, 0), weight: 1, hidden: false }
    ]);
    let entries = $derived(inputs.filter((it) => it.name.trim() != '' && !it.hidden));

    let result: number | null = $state(null);
    let started = $state(false);

    let progressInverval: NodeJS.Timeout | null = $state(null);
    let stopInterval: NodeJS.Timeout | null = $state(null);
    let progress = $state(0);
    let speed = $state(10);

    let removeAllDialog = $state(false);

    function resolveAngle(): number {
        return entries.length > 1 ? 360 / entries.length : 360;
    }

    function createColor(index: number): Color {
        const stepAngle = resolveAngle();
        const hue = (stepAngle * index + stepAngle * (index + 1)) / 2;
        return Color.fromHSL(hue % 360, 100, 80);
    }

    function createArc(index: number): Vec2 {
        const angle = resolveAngle() * index;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 50 * Math.cos(rad);
        const y = 50 + 50 * Math.sin(rad);

        return { x: x, y: y };
    }

    function createArcParam(index: number): string {
        const start = createArc(index);
        const end = createArc(index + 1);
        if (entries.length <= 0) {
            return '';
        } else if (entries.length == 1) {
            return 'M 50 50 L 50 0 A 50 50 0 0 1 50 100 A 50 50 0 0 1 50 0';
        } else {
            return `M 50 50 L ${start.x} ${start.y} A 50 50 0 0 1 ${end.x} ${end.y}`;
        }
    }

    function createTextSize(index: number): number {
        const padding = 0.65;
        const placement = 0.7;
        const length = entries[index].name.length * 1.5;
        const arc = 2 * Math.PI * placement * padding;

        return Math.min((arc / (entries.length * length)) * 50, 25);
    }

    function createTextX(index: number): number {
        const angle = (resolveAngle() / 2) * (index * 2 + 1);
        return 50 + 33 * Math.cos(angle * (Math.PI / 180));
    }

    function createTextY(index: number): number {
        const angle = (resolveAngle() / 2) * (index * 2 + 1);
        const offset = createTextSize(index) * 0.07;
        return 50 + 33 * Math.sin(angle * (Math.PI / 180)) - offset;
    }

    function clearIntervals() {
        if (stopInterval != null) clearInterval(stopInterval);
        if (progressInverval != null) clearInterval(progressInverval);
        stopInterval = null;
        progressInverval = null;
    }

    function reset() {
        clearIntervals();
        progress = 0;
        speed = 10;
        result = null;
    }

    function getResult() {
        const currentAngle = progress % 360;
        const stepAngle = resolveAngle();
        const normalized = (((0 - currentAngle) % 360) + 360) % 360;
        const index = Math.floor(normalized / stepAngle) % entries.length;
        result = index;
    }

    function start() {
        reset();
        started = true;
        progressInverval = setInterval(() => {
            progress += speed;
            getResult();
        }, 10);
    }

    function stopNow() {
        clearIntervals();
        started = false;
        getResult();
    }

    function skipStoppingAnimation() {
        clearIntervals();
        while (speed > 0.025) {
            progress += speed * 80;
            if (speed > 1) {
                speed -= 1;
            } else {
                speed -= 0.25;
            }
        }
        getResult();
    }

    function stop() {
        if (stopInterval == null) {
            stopInterval = setInterval(() => {
                if (speed > 1) {
                    speed -= 1;
                } else {
                    speed -= 0.25;
                }
                if (speed <= 0.0025) stopNow();
            }, 800);
        }
    }

    function hideCurrent() {
        if (result == null) return;
        entries[result].hidden = true;
        result = null;
    }

    function hideAll() {
        for (let index = 0; index < inputs.length; index++) {
            inputs[index].hidden = true;
        }
        result = null;
    }
    function showAll() {
        for (let index = 0; index < inputs.length; index++) {
            inputs[index].hidden = false;
        }
        result = null;
    }

    function handleUpdateEntries() {
        result = null;
        inputs = inputs.filter((it) => it.name.trim() != '');
        inputs.push({ name: '', color: Color.fromRGB(0, 0, 0), weight: 0, hidden: false });
        if (browser) {
            save();
        }
    }

    function handleKey(ev: KeyboardEvent, currentIndex: number) {
        switch (ev.key) {
            case 'Enter':
                const nextElement = Array.from(document.querySelectorAll('.inputs input[type="text"]')).at(currentIndex + 1);
                if (nextElement !== undefined && nextElement instanceof HTMLInputElement) nextElement.focus();
                break;
            case 'Backspace':
                if (currentIndex <= 0) return;
                if (ev.target instanceof HTMLInputElement && ev.target.value == '') {
                    ev.preventDefault();
                    const prevElement = Array.from(document.querySelectorAll('.inputs input[type="text"]')).at(currentIndex - 1);
                    if (prevElement !== undefined && prevElement instanceof HTMLInputElement) prevElement.focus();
                }
                break;
        }
    }

    function load() {
        const data = localStorage.getItem('roulette');
        if (data == null) return;
        try {
            const raw = JSON.parse(data);
            if (inputs.length >= 2) inputs = raw;

            handleUpdateEntries();
        } catch (e) {
            dataError = true;
            console.error(e);
        }
    }

    function save() {
        const data = JSON.stringify(entries);
        localStorage.setItem('roulette', data);
    }

    function resetData() {
        localStorage.removeItem('roulette');
        inputs = [];
        handleUpdateEntries();
        removeAllDialog = false;
        save();
    }

    $effect(() => {
        for (let index = 0; index < entries.length; index++) {
            entries[index].color = createColor(index);
        }
    });

    onMount(() => load());
</script>

<Dialog title="エラー" show={dataError}>
    <p>データのの読み込み中にエラーが発生しました。<br />使用するにはリセットを行う必要があります。</p>
    <Buttons>
        <Button onclick={resetData}>データリセット</Button>
    </Buttons>
</Dialog>

<Dialog title="確認" show={removeAllDialog} closeable={true}>
    <p>本当にすべての項目を削除してもよろしいですか?<br />この操作はもとに戻すことができません</p>
    <Buttons>
        <Button onclick={() => resetData()}>はい</Button>
        <Button onclick={() => (removeAllDialog = false)}>いいえ</Button>
    </Buttons>
</Dialog>

<Container>
    <h1>ルーレット</h1>
    <hr />
    <div class="main">
        <div class="roulette-container">
            <div class="result">
                {#if result != null}
                    <p>
                        {#if started}
                            {entries[result].name}
                        {:else}
                            <b>{entries[result].name}</b>
                        {/if}
                    </p>
                {:else}
                    <p>スタートを押して開始</p>
                {/if}
            </div>
            <div class="roulette">
                {#if entries.length >= 1}
                    <svg height="400" width="400" viewBox="0 0 120 120">
                        <g transform="rotate({progress % 360})" transform-origin="50 50">
                            {#each entries as input, index}
                                <g>
                                    <path d="{createArcParam(index)} Z" fill={'#' + input.color.hex} />
                                    <text
                                        x={createTextX(index)}
                                        y={createTextY(index)}
                                        font-size={createTextSize(index)}
                                        text-anchor="middle"
                                        dominant-baseline="central"
                                    >
                                        {input.name}
                                    </text>
                                </g>
                            {/each}
                        </g>
                        <path d="M 98 50 l 5 -3 l 0 6 l -5 -3 Z" fill="red" stroke="#111" />
                        <circle cx="50" cy="50" r="3" fill="white" stroke="#222" />
                    </svg>
                {:else}
                    <p>リストを入力...</p>
                {/if}
            </div>
        </div>
        <div class="controls">
            <div class="inputs">
                {#each inputs as input, index}
                    <div class="input">
                        {#if input.name.trim() != ''}
                            <CheckBox
                                id="disabled_{index}"
                                bind:checked={() => !input.hidden, (v) => (input.hidden = !v)}
                                onchange={handleUpdateEntries}
                            ></CheckBox>
                        {:else}
                            <div class="dummy-checkbox"></div>
                        {/if}
                        <input type="text" bind:value={input.name} onkeydown={(ev) => handleKey(ev, index)} oninput={handleUpdateEntries} />
                    </div>
                {/each}
                <Button onclick={() => (removeAllDialog = true)}>すべて削除</Button>
                <Buttons>
                    <Button onclick={showAll}>すべて表示</Button>
                    <Button onclick={hideAll}>すべて非表示</Button>
                </Buttons>
            </div>
        </div>
    </div>
    <div class="buttons">
        {#if entries.length >= 1}
            <Buttons>
                {#if progressInverval == null && stopInterval == null}
                    <Button inline onclick={start}>スタート</Button>
                    <Button inline onclick={reset}>リセット</Button>
                    {#if result != null}
                        <Button inline onclick={hideCurrent}>{entries[result].name}を非表示</Button>
                    {/if}
                {:else if progressInverval != null && stopInterval == null}
                    <Button inline onclick={stop}>ストップ</Button>
                    <Button inline onclick={stopNow}>その場でストップ</Button>
                {:else if progressInverval != null && stopInterval != null}
                    <Button inline disabled>停止中...</Button>
                    <Button inline onclick={stopNow}>その場でストップ</Button>
                    <Button inline onclick={skipStoppingAnimation}>アニメーションをスキップ</Button>
                {/if}
            </Buttons>
        {/if}
    </div>
</Container>

<style>
    .buttons {
        position: sticky;
        bottom: 10px;
    }
    .controls input[type='text'] {
        resize: none;
        padding: 5px;
        outline: none;
        height: 100%;
        background-color: #111;
        border-radius: 5px;
        border: 1px solid #666;
        color: #fff;
    }
    .input {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .controls .inputs {
        display: flex;
        gap: 5px;
        flex-direction: column;
    }
    .roulette-container {
        flex-grow: 1;
    }
    .result {
        text-align: center;
        background-color: #111;
        padding: 5px;
        border-radius: 5px;
    }
    .result p {
        display: inline;
    }
    .dummy-checkbox {
        width: 24px;
        padding: 5px;
    }
    .roulette {
        display: flex;
        margin: 30px;
        justify-content: center;
        align-items: center;
    }
    .main {
        display: flex;
        gap: 10px;
        margin: 20px 0;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
