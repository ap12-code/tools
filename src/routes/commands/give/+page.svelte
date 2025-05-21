<script lang="ts">
    import Container from "$components/Container.svelte";
    import McText from "$components/MCText.svelte";
    import _ from "lodash";
    import type { PageServerData } from "./$types";
    import { isTextData } from "$lib/utils";
    import { onMount } from "svelte";
    import type { Item, Nullable } from "$lib/data/types";
    import type { ComponentMap } from "$lib/data/components";
    import { SNBT } from "$lib/snbt";
    import Button from "$components/Button.svelte";
    import Tabs from "$components/tab/Tabs.svelte";
    import Tooltip from "$components/Tooltip.svelte";
    import Text from "$components/form/Text.svelte";
    import Select from "$components/form/Select.svelte";
    import Number from "$components/form/Number.svelte";
    import { ActionResult, numberValidator } from "$lib/types";
    interface Props {
        data: PageServerData;
    }

    let { data }: Props = $props();
    let search = $state("");
    let items: Item[] = $state([]);
    let item: Nullable<Item> = $state();
    let count = $state(1);
    let itemId: Nullable<string> = $state(null);
    let is_food = $state(false);
    let components: ComponentMap = $state({ food: {} });
    let command = $state("アイテムを選択してください");
    let copied = $state(false);
    let auto_save = true;

    type GiveCommandData = {
        components: ComponentMap;
        count: number;
        item: Nullable<Item>;
        is_food: boolean;
    };

    let old_command: Nullable<string> = null;
    let histories: GiveCommandData[] = [];
    let redoed: GiveCommandData[] = [];
    let history_cursor: number = -1;

    function loadBrowser() {
        const data = localStorage.getItem("data:commands/give");
        if (!data) return;
        const parsed: GiveCommandData = JSON.parse(data);
        components = parsed.components;
        count = parsed.count;
        if (parsed.item) item = parsed.item;
        if (parsed.item) itemId = parsed.item.id;
        is_food = parsed.is_food;
    }

    function saveBrowser() {
        if (!item) return;
        const data: GiveCommandData = {
            components: components,
            count: count,
            is_food: is_food,
            item: item,
        };

        localStorage.setItem("data:commands/give", JSON.stringify(data));
    }

    function undo() {
        if (history_cursor <= 0) return;
        history_cursor -= 1;
        const parsed = histories[history_cursor];
        if (!parsed) return;
        console.log("UNDO ", parsed);
        console.log(histories);

        components = parsed.components;
        count = parsed.count;
        if (parsed.item) item = parsed.item;
        if (parsed.item) itemId = parsed.item.id;
        is_food = parsed.is_food;

        updateOutput();
    }
    function redo() {
        if (history_cursor >= histories.length) return;
        history_cursor += 1;
        const parsed = histories[history_cursor];
        console.log("REDO ", parsed);
        console.log(histories);
        if (!parsed) return;

        components = parsed.components;
        count = parsed.count;
        if (parsed.item) item = parsed.item;
        if (parsed.item) itemId = parsed.item.id;
        is_food = parsed.is_food;

        updateOutput();
    }

    function copyOutput() {
        updateOutput();
        if (!item) {
            alert("先にアイテムを選択してください");
            return;
        }
        navigator.clipboard.writeText(command);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 500);
    }

    function updateAutoSave() {
        localStorage.setItem("data:commands/give/autosave", auto_save.toString());
    }

    function loadAutoSave() {
        const autosave = localStorage.getItem("data:commands/give/autosave");
        if (!autosave) return;
        auto_save = Boolean(autosave);
    }

    function saveHistory() {
        // TODO: history
        return;
        const data: GiveCommandData = {
            components: components,
            count: count,
            is_food: is_food,
            item: item,
        };
        histories.push(data);
        histories = histories;
        history_cursor = histories.length;
        redoed = [];
    }

    function deleteBrowser() {
        const bl = confirm(
            "確認\n\nブラウザに保存されているコマンドのデータを消去し、すべての項目をリセットします。よろしいですか?\n\nこの操作は元に戻せません!",
        );
        if (!bl) return;
        localStorage.removeItem("data:commands/give");
        components = {};
        count = 1;
        item = null;
        itemId = null;
        is_food = false;
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

        if (!item) {
            command = "アイテムを選択してください";
            return;
        }
        output.push("/give", "@s");
        let parsed_components: string[] = [];

        // food updates...
        if (!is_food) {
            components.food = undefined;
        } else {
            if (components.food == undefined) components.food = {};
        }

        for (let [k, v] of Object.entries(components)) {
            if (!v) continue;
            if (isTextData(v)) {
                if (v != "") {
                    parsed_components.push(`minecraft:${k}='${JSON.stringify(v)}'`);
                }
                continue;
            }
            if (typeof v === "string") {
                parsed_components.push(`minecraft:${k}="${v}"`);
            } else if (typeof v === "boolean") {
                if (v) {
                    parsed_components.push(`minecraft:${k}={}`);
                }
            } else if (typeof v === "object") {
                parsed_components.push(`minecraft:${k}=${SNBT.stringify(v)}`);
            } else {
                parsed_components.push(`minecraft:${k}=${v}`);
            }
        }
        const cs = parsed_components.length >= 1 ? `[${parsed_components.join(",")}]` : "";

        output.push(`${item.id}${cs}`);
        output.push(`${count}`);

        command = output.join(" ");
        saveBrowser();
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
            .filter((p) => p.id.split(":")[1].includes(search));
        if (items.length >= 1 && itemId != null) {
            itemId = items[0].id;
            updateItem();
        } else {
            itemId = null;
            updateItem();
        }
    }

    onMount(() => {
        loadBrowser();
        loadAutoSave();
        refreshSearch();
    });
</script>

<div>
    <Container back_to="/commands">
        <h1>/giveコマンドジェネレーター</h1>
        <span>対応バージョン: 1.21.1</span>
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
                    <Button onclick={copyOutput}><i class="bi bi-clipboard2"></i> {copied ? "コピーしました" : "コピー"}</Button>
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
                <Tabs tabs={["基本", "外観", "動作"]}>
                    {#snippet tab({ name }: { name: string })}
                        {#if item}
                            <div class="components">
                                {#if name == "基本"}
                                    <Number bind:value={count} validator={numberValidator({ max: 6400, min: 1 })} label="数量" oninput={updateOutput}
                                    ></Number>
                                    <Number bind:value={components.max_stack_size} label="最大スタック数" oninput={updateOutput}></Number>
                                    <Select label="レアリティ" bind:value={components.rarity} oninput={updateOutput}>
                                        <option value={null}>設定しない</option>
                                        <option value="common">Common</option>
                                        <option value="uncommon">Uncommon</option>
                                        <option value="rare">Rare</option>
                                        <option value="epic">Epic</option>
                                    </Select>
                                {:else if name == "外観"}
                                    <div class="item-ctm component">
                                        <label for="rarity">ツールチップの表示</label>
                                        <select class="select" id="rarity" bind:value={components.hide_tooltip} onchange={refreshOutput}>
                                            <option value={null}>表示</option>
                                            <option value={true}>非表示</option>
                                        </select>
                                    </div>
                                    <div class="item-ctm component">
                                        <label for="rarity">追加のツールチップの表示</label>
                                        <select class="select" id="rarity" bind:value={components.hide_additional_tooltip} onchange={refreshOutput}>
                                            <option value={null}>表示</option>
                                            <option value={true}>非表示</option>
                                        </select>
                                    </div>
                                    <div class="custom-name component">
                                        <span>カスタム名</span>
                                        <McText bind:data={components.custom_name} update={refreshOutput}></McText>
                                    </div>
                                    <div class="item-name component">
                                        <span>アイテム名</span>
                                        <McText bind:data={components.item_name} update={refreshOutput}></McText>
                                    </div>
                                {:else if name == "動作"}
                                    <div class="item-ctm component">
                                        <label for="rarity">炎への耐性</label>
                                        <select class="select" id="rarity" bind:value={components.fire_resistant} onchange={refreshOutput}>
                                            <option value={null}>なし</option>
                                            <option value={true}>あり</option>
                                        </select>
                                    </div>
                                    <div class="item-food component">
                                        <label for="food">食用可能</label>
                                        <div class="child-components">
                                            <select class="select" bind:value={is_food} onchange={refreshOutput}>
                                                <option value={true}>はい</option>
                                                <option value={false}>いいえ</option>
                                            </select>
                                            {#if components.food && is_food}
                                                <div class="component">
                                                    <label for="food-nutrition">満腹度</label>
                                                    <input
                                                        type="number"
                                                        class="input-number"
                                                        id="food-nutrition"
                                                        bind:value={components.food.nutrition}
                                                        oninput={refreshOutput}
                                                    />
                                                </div>
                                                <div class="component">
                                                    <label for="food-saturation">隠し満腹度</label>
                                                    <input
                                                        type="number"
                                                        class="input-number"
                                                        id="food-saturation"
                                                        bind:value={components.food.saturation}
                                                        oninput={refreshOutput}
                                                    />
                                                </div>
                                                <div class="component">
                                                    <label for="food-eat-seconds">必要時間</label>
                                                    <input
                                                        type="number"
                                                        class="input-number"
                                                        id="food-eat-seconds"
                                                        bind:value={components.food.eat_seconds}
                                                        oninput={refreshOutput}
                                                    />
                                                </div>
                                                <div class="component">
                                                    <label for="food-eat-seconds">いつでも食べれる</label>
                                                    <select
                                                        class="select"
                                                        id="rarity"
                                                        bind:value={components.food.can_always_eat}
                                                        onchange={refreshOutput}
                                                    >
                                                        <option value={null}>いいえ</option>
                                                        <option value={true}>はい</option>
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
    .input-number {
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
