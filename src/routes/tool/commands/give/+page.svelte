<script lang="ts">
    import Container from '$components/Container.svelte';
    import McText from '$components/MCText.svelte';
    import type { PageServerData } from './$types';
    import { isTextData } from '$lib/utils';
    import type { Item, Nullable } from '$lib/minecraft/types';
    import { ComponentMap, DataComponentTypes } from '$lib/minecraft/components/index.svelte';
    import Button from '$components/Button.svelte';
    import Tabs from '$components/tab/Tabs.svelte';
    import { browser } from '$app/environment';
    import { Rarity } from '$lib/minecraft/components/1.21.8/rarity';
    import Tooltip from '$components/Tooltip.svelte';
    import Dialog from '$components/Dialog.svelte';
    import { goto } from '$app/navigation';
    interface Props {
        data: PageServerData;
    }

    let { data }: Props = $props();
    let search = $state('');
    let items: Item[] = $state([]);
    let item: Nullable<Item> = $state();
    let count = $state(1);
    let itemId: Nullable<string> = $state(null);
    let components: ComponentMap = $state(new ComponentMap());
    let command = $state('アイテムを選択してください');
    let copied = $state(false);
    let loading = $state(true);
    let auto_save = true;

    type GiveCommandData = {
        components: ComponentMap;
        count: number;
        item: Nullable<Item>;
    };

    let old_command: Nullable<string> = null;
    let histories: GiveCommandData[] = [];
    let redoed: GiveCommandData[] = [];
    let history_cursor: number = -1;

    const LOCAL_STORAGE_KEY = 'data:commands/give';

    function loadBrowser() {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!savedData) return;
        const parsed = JSON.parse(savedData);
        // console.log(savedData);
        try {
            components.deserialize(parsed.components);
            count = parsed.count;
            if (parsed.item) item = parsed.item;
            if (parsed.item) itemId = parsed.item.id;
        } catch {
            const check = confirm(
                'データ読み込み中にエラーが発生しました。\n正常にページを読み込むには保存済みのコマンドをリセットする必要があります。\n続行してもよろしいですか?'
            );
            if (check) {
                deleteBrowser();
            } else {
                goto('/commands');
            }
        }
    }

    function saveBrowser() {
        if (!browser) return;
        if (!item) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } else {
            const data = {
                components: components.serialize(),
                count: count,
                item: item
            };

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
    }

    function undo() {
        if (history_cursor <= 0) return;
        history_cursor -= 1;
        const parsed = histories[history_cursor];
        if (!parsed) return;
        console.log('UNDO ', parsed);
        console.log(histories);

        components = parsed.components;
        count = parsed.count;
        if (parsed.item) item = parsed.item;
        if (parsed.item) itemId = parsed.item.id;

        updateOutput();
    }
    function redo() {
        if (history_cursor >= histories.length) return;
        history_cursor += 1;
        const parsed = histories[history_cursor];
        console.log('REDO ', parsed);
        console.log(histories);
        if (!parsed) return;

        components = parsed.components;
        count = parsed.count;
        if (parsed.item) item = parsed.item;
        if (parsed.item) itemId = parsed.item.id;

        updateOutput();
    }

    function copyOutput() {
        updateOutput();
        if (!item) {
            return;
        }
        navigator.clipboard.writeText(command);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 500);
    }

    function updateAutoSave() {
        localStorage.setItem('data:commands/give/autosave', auto_save.toString());
    }

    function loadAutoSave() {
        const autosave = localStorage.getItem('data:commands/give/autosave');
        if (!autosave) return;
        auto_save = Boolean(autosave);
    }

    function saveHistory() {
        // TODO: history
        return;
        const data: GiveCommandData = {
            components: components,
            count: count,
            item: item
        };
        histories.push(data);
        histories = histories;
        history_cursor = histories.length;
        redoed = [];
    }

    function deleteBrowser() {
        const bl = confirm(
            '確認\n\nブラウザに保存されているコマンドのデータを消去し、すべての項目をリセットします。よろしいですか?\n\nこの操作は元に戻せません!'
        );
        if (!bl) return;
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        components = new ComponentMap();
        count = 1;
        item = null;
        itemId = null;
        histories = [];
        history_cursor = 0;
        saveBrowser();
        refreshOutput();
    }

    function updateItem() {
        const selItem = items.find((i) => i.id == itemId);
        if (!selItem || !itemId) {
            item = null;
            updateOutput();
            return;
        }
        item = selItem;
        saveHistory();
        updateOutput();
    }

    function updateOutput() {
        let output: string[] = [];

        saveBrowser();
        if (!item) {
            command = 'アイテムを選択してください';
            return;
        }
        if (count < 1) count = 1;
        if (count > 6400) count = 6400;

        output.push('/give', '@s');
        let parsed_components: string[] = [];

        for (let [k, v] of components.entries()) {
            if (!v) continue;
            const key = k.getId();
            if (isTextData(v)) {
                if (v != '') {
                    parsed_components.push(`minecraft:${key}=${JSON.stringify(v)}`);
                }
                continue;
            }
            parsed_components.push(`${key}=${v.serialize()}`);
        }
        const cs = parsed_components.length >= 1 ? `[${parsed_components.join(',')}]` : '';

        output.push(`${item.id}${cs}`);
        output.push(`${count}`);

        command = output.join(' ');
    }

    function refreshOutput() {
        if (old_command == null) old_command = command;
        if (command != old_command) saveHistory();
        old_command = command;

        updateOutput();
    }

    function refreshSearch() {
        items = data.items
            .sort((a, b) => a.id.length - b.id.length)
            .sort((a, b) => a.id.localeCompare(b.id))
            .filter((p) => (search ? p.id.split(':')[1].includes(search) : true));

        if (items.length >= 1 && itemId != null) {
            itemId = items[0].id;
            updateItem();
        } else {
            itemId = null;
            updateItem();
        }
    }

    if (browser) {
        loadBrowser();
        loadAutoSave();
        loading = false;
    }
    refreshSearch();
</script>

<Dialog></Dialog>

<div>
    <Container back_to="/tool/commands">
        <h1>/giveコマンドジェネレーター</h1>
        <span>対応バージョン: 1.21.8</span>
        {#if loading}
            <hr />
            <p>データ読み込み中...</p>
        {:else}
            <p>開発中です。バグがございましたらdiscordにてご連絡ください</p>
            <hr />
            <div class="outputs">
                <div class="output-actions">
                    <span>
                        出力
                        {#if item}
                            - {command.length}文字
                        {/if}
                    </span>
                    <div>
                        <Button onclick={refreshOutput}><i class="bi bi-arrow-clockwise"></i> 出力を更新</Button>
                        <Button onclick={copyOutput}>
                            <i class="bi bi-clipboard2"></i>
                            {copied ? 'コピーしました' : 'コピー'}
                        </Button>
                        <Button onclick={deleteBrowser}><i class="bi bi-trash"></i> リセット</Button>
                    </div>
                </div>
                {#key command}
                    <span class="output">{command}</span>
                {/key}
            </div>
            <hr />
            <div class="main">
                <div class="item">
                    <label for="itemid">アイテム</label>
                    <select id="itemid" class="input-item select" placeholder="選択してください" bind:value={itemId} onchange={updateItem}>
                        <option value={null}>選択してください...</option>
                        {#each items as itemI}
                            <option value={itemI.id}>{itemI.id}</option>
                        {/each}
                    </select>
                    <input type="text" class="input-text" placeholder="検索..." bind:value={search} oninput={refreshSearch} />
                </div>
                {#if item}
                    <Tabs tabs={['基本', '外観', '動作']}>
                        {#snippet tab({ name }: { name: string })}
                            {#if item}
                                <div class="components">
                                    {#if name == '基本'}
                                        <div class="item-ctm component">
                                            <label for="count">数量</label>
                                            <input
                                                type="number"
                                                class="input-number"
                                                id="count"
                                                min={1}
                                                max={6400}
                                                bind:value={count}
                                                oninput={updateOutput}
                                            />
                                        </div>
                                        <div class="item-ctm component">
                                            <label for="max-stack-size">最大スタック数</label>
                                            <input
                                                type="number"
                                                class="input-number"
                                                bind:value={
                                                    () => components.get(DataComponentTypes.MAX_STACK_SIZE)?.get()?.getValue(),
                                                    (v) =>
                                                        components.compute(DataComponentTypes.MAX_STACK_SIZE, Boolean(v), (c) =>
                                                            c.get()?.setValue(v!)
                                                        )
                                                }
                                                id="max-stack-size"
                                                oninput={updateOutput}
                                            />
                                        </div>
                                    {:else if name == '外観'}
                                        <div class="component">
                                            <label for="rarity">レアリティ</label>
                                            <select
                                                class="select"
                                                id="rarity"
                                                bind:value={
                                                    () => components.get(DataComponentTypes.RARITY)?.toString() || null,
                                                    (v) => components.put(DataComponentTypes.RARITY, Rarity.valueOf(v!) || null)
                                                }
                                                onchange={updateOutput}
                                            >
                                                <option value={null}>設定しない</option>
                                                {#each Rarity.values() as value}
                                                    <option value={value.toString()}>{value.toString()}</option>
                                                {/each}
                                            </select>
                                        </div>
                                        <div class="item-ctm component">
                                            <label for="hide-tooltip">ツールチップ</label>
                                            <div class="child-components">
                                                <select
                                                    class="select"
                                                    id="hide-tooltip"
                                                    bind:value={
                                                        () => components.has(DataComponentTypes.TOOLTIP_DISPLAY),
                                                        (v) => components.compute(DataComponentTypes.TOOLTIP_DISPLAY, v)
                                                    }
                                                    onchange={refreshOutput}
                                                >
                                                    <option value={false}>設定しない</option>
                                                    <option value={true}>設定する</option>
                                                </select>
                                                {#key components.map}
                                                    {#if components.has(DataComponentTypes.TOOLTIP_DISPLAY)}
                                                        <div class="component">
                                                            <label for="tooltip-display">表示</label>
                                                            <select
                                                                class="select"
                                                                id="tooltip-display"
                                                                bind:value={
                                                                    () => components.getOrPut(DataComponentTypes.TOOLTIP_DISPLAY).getHideTooltip(),
                                                                    (v) => components.getOrPut(DataComponentTypes.TOOLTIP_DISPLAY).setHideTooltip(v)
                                                                }
                                                                onchange={refreshOutput}
                                                            >
                                                                <option value={false}>表示</option>
                                                                <option value={true}>非表示</option>
                                                            </select>
                                                        </div>
                                                    {/if}
                                                {/key}
                                            </div>
                                        </div>
                                        <div class="item-ctm component">
                                            <label for="enchantment-glint-override">
                                                <Tooltip text="ONにすると、アイテムをエンチャントしたかのように発光させます。">発光</Tooltip>
                                            </label>

                                            <select
                                                class="select"
                                                id="enchantment-glint-override"
                                                bind:value={
                                                    () => components.get(DataComponentTypes.ENCHANTMENT_GLINT_OVERRIDE)?.getValue() || null,
                                                    (v) =>
                                                        components.compute(DataComponentTypes.ENCHANTMENT_GLINT_OVERRIDE, v !== null, (c) =>
                                                            c.setValue(v!)
                                                        )
                                                }
                                                onchange={updateOutput}
                                            >
                                                <option value={null}>設定しない</option>
                                                <option value={true}>発光させる</option>
                                                <option value={false}>発光させない</option>
                                            </select>
                                        </div>
                                        <div class="custom-name component">
                                            <span>カスタム名</span>
                                            <McText
                                                bind:data={
                                                    () => components.get(DataComponentTypes.CUSTOM_NAME)?.getText(),
                                                    (v) => components.compute(DataComponentTypes.CUSTOM_NAME, Boolean(v), (c) => c.setText(v))
                                                }
                                                update={refreshOutput}
                                            ></McText>
                                        </div>
                                        <div class="item-name component">
                                            <span>アイテム名</span>
                                            <McText
                                                bind:data={
                                                    () => components.get(DataComponentTypes.ITEM_NAME)?.getText(),
                                                    (v) => components.compute(DataComponentTypes.ITEM_NAME, Boolean(v), (c) => c.setText(v))
                                                }
                                                update={refreshOutput}
                                            ></McText>
                                        </div>
                                    {:else if name == '動作'}
                                        <div class="item-ctm component">
                                            <label for="damage_resistant">ダメージへの耐性</label>
                                            <div class="child-components">
                                                <select
                                                    id="damage_resistant"
                                                    class="select"
                                                    bind:value={
                                                        () => components.has(DataComponentTypes.DAMAGE_RESISTANT),
                                                        (v) => components.compute(DataComponentTypes.DAMAGE_RESISTANT, v)
                                                    }
                                                    onchange={refreshOutput}
                                                >
                                                    <option value={true}>はい</option>
                                                    <option value={false}>いいえ</option>
                                                </select>
                                                {#if components.has(DataComponentTypes.DAMAGE_RESISTANT)}
                                                    <div class="component">
                                                        <label for="damage_resistant_types">ダメージの種類</label>
                                                        <select
                                                            class="select"
                                                            id="damage_resistant_types"
                                                            bind:value={
                                                                () => components.getOrPut(DataComponentTypes.DAMAGE_RESISTANT).getTypes() || null,
                                                                (v) =>
                                                                    components.compute(DataComponentTypes.DAMAGE_RESISTANT, Boolean(v), (c) =>
                                                                        c.setTypes(v!)
                                                                    )
                                                            }
                                                            onchange={refreshOutput}
                                                        >
                                                            <option value={null} disabled>選択してください...</option>
                                                            {#each data.damage_tags as damage_tag}
                                                                <option value={'#' + damage_tag.id}>#{damage_tag.id}</option>
                                                            {/each}
                                                        </select>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="item-food component">
                                            <label for="food">満腹度の設定</label>
                                            <div class="child-components">
                                                <select
                                                    id="food"
                                                    class="select"
                                                    bind:value={
                                                        () => components.has(DataComponentTypes.FOOD),
                                                        (v) => components.compute(DataComponentTypes.FOOD, v)
                                                    }
                                                    onchange={refreshOutput}
                                                >
                                                    <option value={true}>はい</option>
                                                    <option value={false}>いいえ</option>
                                                </select>
                                                {#if components.has(DataComponentTypes.FOOD)}
                                                    <div class="component">
                                                        <label for="food-nutrition">満腹度</label>
                                                        <input
                                                            bind:value={
                                                                () => components.getOrPut(DataComponentTypes.FOOD).getNutrition(),
                                                                (v) => components.getOrPut(DataComponentTypes.FOOD).setNutrition(v)
                                                            }
                                                            type="number"
                                                            class="input-number"
                                                            id="food-nutrition"
                                                            oninput={refreshOutput}
                                                        />
                                                    </div>
                                                    <div class="component">
                                                        <label for="food-saturation">隠し満腹度</label>
                                                        <input
                                                            bind:value={
                                                                () => components.getOrPut(DataComponentTypes.FOOD).getSaturation(),
                                                                (v) => components.getOrPut(DataComponentTypes.FOOD).setSaturation(v)
                                                            }
                                                            type="number"
                                                            class="input-number"
                                                            id="food-saturation"
                                                            oninput={refreshOutput}
                                                        />
                                                    </div>
                                                    <div class="component">
                                                        <label for="food-can-always-eat">いつでも食べれる</label>
                                                        <select
                                                            bind:value={
                                                                () => components.getOrPut(DataComponentTypes.FOOD).getCanAlwaysEat(),
                                                                (v) => components.getOrPut(DataComponentTypes.FOOD).setCanAlwaysEat(v)
                                                            }
                                                            class="select"
                                                            id="food-can-always-eat"
                                                            onchange={refreshOutput}
                                                        >
                                                            <option value={true}>はい</option>
                                                            <option value={false}>いいえ</option>
                                                        </select>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        {/snippet}
                    </Tabs>
                {/if}
            </div>
        {/if}
    </Container>
</div>

<style>
    hr {
        width: 100%;
        border-color: #888;
    }
    .child-components {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 10px;
    }
    .child-components input {
        flex-grow: 1;
    }
    .output {
        border: #bbb 1px solid;
        padding: 10px;
        border-radius: 5px;
        flex-grow: 1;
        word-wrap: normal;
        line-break: anywhere;
        font-family: monospace;
        word-break: break-all;
        max-width: 100%;
    }
    .components {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .component {
        display: flex;
    }
    .component label,
    .component span {
        width: 200px;
    }
    .main {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .item {
        display: flex;
        gap: 10px;
    }
    .select {
        flex: 2 1;
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
    }
    .input-text {
        flex: 1 1;
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        border: 1px solid #777;
    }
    :global(.input-number) {
        flex: 1 1;
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        padding: 5px;
        border: 1px solid #777;
    }
    input,
    select:focus {
        outline: none;
    }
    .outputs {
        display: flex;
        gap: 10px;
        flex-direction: column;
    }
    .output-actions {
        display: flex;
        gap: 10px;
    }
    .output-actions > div {
        margin-left: auto;
        display: flex;
        gap: 5px;
    }
    .output {
        height: 50px;
    }
</style>
