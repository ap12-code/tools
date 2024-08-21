<script lang="ts">
    import Button from "$components/Button.svelte";
    import Container from "$components/Container.svelte";
    import Dialog from "$components/Dialog.svelte";
    import McText from "$components/MCText.svelte";
    import type { PageServerData } from "./$types";
    export let data: PageServerData;
    let search = "";
    let items: Item[] = [];
    let item: Item | null = null;
    let count = 1;
    let itemId = "";
    type Components = {
        custom_model_data: number | null;
        damage: number | null;
        max_stack_size: number | null;
        rarity: string | null;
    };
    type TextDialogData = {
        [k: string]: {
            name: string
            show: boolean
            data: TextData
        }
    }

    const text_dialogs: TextDialogData = {
        dialog1: {
            name: "アイテム名",
            show: false,
            data: ""
        }
    }

    const components: Components = {
        custom_model_data: null,
        damage: null,
        max_stack_size: null,
        rarity: null
    };
    let command = "アイテムを選択してください";

    function updateItem() {
        const selItem = items.find((i) => i.id == itemId);
        if (!selItem || itemId == "") {
            item = null
            refreshOutput();
            return
        }
        item = selItem;
        refreshOutput();
    }

    function refreshOutput() {
        let output: string[] = [];

        if (!item) {
            command = "アイテムを選択してください";
            return
        }
        output.push("/give", "@s");
        let parsed_components: string[] = [];
        for (let [k, v] of Object.entries(components)) {
            if (!v) continue;
            if (typeof v === "string") {
                parsed_components.push(`minecraft:${k}="${v}"`);
            } else {
                parsed_components.push(`minecraft:${k}=${v}`);
            }
        }
        const cs = parsed_components.length >= 1 ? `[${parsed_components.join(",")}]` : "";

        output.push(`${item.id}${cs}`);
        if ((components.max_stack_size || 0) <= item.max_stack_size) {
            if (count > item.max_stack_size) {
                count = item.max_stack_size
            }
        }
        if (count < 1) count = 1;
        output.push(`${count}`);

        command = output.join(" ");
    }

    function refreshSearch() {
        items = data.items
            .sort((a, b) => a.id.length - b.id.length)
            .sort((a, b) => a.id.localeCompare(b.id))
            .filter((p) => p.id.split(":")[1].includes(search));
        if (items.length >= 1) {
            itemId = items[0].id;
            updateItem();
        }
    }

    function show(name: string) {
        text_dialogs[name].show = true;
    }

    refreshSearch();
    refreshOutput();
</script>

<div class="dialogs">
    <div class="dialog">
        <Dialog show={text_dialogs.dialog1.show}><McText></McText></Dialog>
    </div>
</div>

<div>
    <Container show_back={false}>
        {#key command}
            <pre>{command}</pre>
        {/key}
        <hr />
        <div class="main">
            <div class="item">
                <label for="itemid">アイテム</label>
                <select
                    id="itemid"
                    class="input-item select"
                    placeholder="選択してください"
                    bind:value={itemId}
                    on:change={updateItem}
                >
                    {#each items as itemI}
                        <option value={itemI.id}>{itemI.id}</option>
                    {/each}
                </select>
                <input
                    type="text"
                    class="input-text"
                    placeholder="検索..."
                    bind:value={search}
                    on:input={refreshSearch}
                />
            </div>
            <hr />
            {#if item}
                <div class="item-count component">
                    <label for="count">数量</label>
                    <input
                        type="number"
                        class="input-number"
                        id="count"
                        bind:value={count}
                        max={Math.max(item.max_stack_size, components.max_stack_size || 0)}
                        min={1}
                        on:input={refreshOutput}
                    />
                </div>
                <div class="item-count component">
                    <label for="count">アイテム名</label>
                    <Button on:click={_ => show("dialog1")}>編集</Button>
                </div>
                <div class="item-count component">
                    <label for="max_stack_size">最大スタック数</label>
                    <input
                        type="number"
                        class="input-number"
                        id="max_stack_size"
                        bind:value={components.max_stack_size}
                        min={1}
                        on:input={refreshOutput}
                    />
                </div>
                <div class="item-ctm component">
                    <label for="custommodeldata">CustomModelData</label>
                    <input
                        type="number"
                        class="input-number"
                        id="custommodeldata"
                        bind:value={components.custom_model_data}
                        max={65535}
                        min={0}
                        on:input={refreshOutput}
                    />
                </div>
                {#if item.max_damage}
                    <div class="item-damage component">
                        <label for="damage">耐久値</label>
                        <input
                            type="number"
                            class="input-number"
                            id="damage"
                            bind:value={components.damage}
                            max={item.max_damage}
                            min={0}
                            on:input={refreshOutput}
                        />
                        <span>/{item.max_damage}</span>
                    </div>
                {/if}
                <div class="item-ctm component">
                    <label for="rarity">レアリティ</label>
                    <select class="select" id="rarity" bind:value={components.rarity} on:change={refreshOutput}>
                        <option value={null}>選択してください...</option>
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                    </select>
                </div>
            {/if}
        </div>
    </Container>
</div>

<style>
    hr {
        width: 100%;
        margin: 40px 0;
        border-color: #bbb;
    }
    pre {
        border: #bbb 1px solid;
        padding: 10px;
        border-radius: 5px;
    }
    .component {
        display: flex;
    }
    .component label {
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
</style>
