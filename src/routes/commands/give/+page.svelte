<script lang="ts">
import Container from "$components/Container.svelte";
import type { Item } from "minecraft-data";
import type { PageServerData } from "./$types";
export let data: PageServerData;
let search = "";
let items: Item[] = [];
let item: Item | null = null;
let count = 1;
const components = {
    custom_model_data: 0,
    damage: 0,
    max_stack_size: 64,
};
let command = "/give @s";

function updateItem(itemId: string) {
    const selItem = items.find((i) => i.name == itemId);
    if (!selItem) item = null;
    components.max_stack_size = selItem.stackSize;
    item = item;
}

function refreshOutput() {
    let output: string[] = [];

    output.push("/give", "@s");
    if (!item) return;
    let parsed_components: string[] = [];
    for (let [k, v] of Object.entries(components)) {
        if (!v) continue;
        parsed_components.push(`minecraft:${k}=${v}`);
    }
    const cs = parsed_components.length >= 1 ? `[${parsed_components.join(",")}]` : "";

    output.push(`minecraft:${item.name}${cs}`);
    if (count > item.stackSize) count = item.stackSize;
    if (count < 1) count = 1;
    output.push(`${count}`);

    command = output.join(" ");
}

function refreshSearch() {
    items = Object.values(data.items)
        .sort((a, b) => a.name.length - b.name.length)
        .filter((p) => p.name.startsWith(search));
    if (items.length >= 1) item = items[0];
}

refreshSearch();
refreshOutput();
</script>

<div>
    <Container>
        {#key command}
            <p>{command}</p>
        {/key}
        <div class="main">
            <div class="item">
                <label for="itemid">アイテム</label>
                <select id="itemid" class="input-item select" bind:value={item} on:select={(ev) => updateItem(ev.currentTarget.value)}>
                    {#each items as item}
                        <option value={item}>minecraft:{item.name}</option>
                    {/each}
                </select>
                <input type="text" class="input-text" placeholder="検索..." bind:value={search} on:input={refreshSearch} />
            </div>
            {#if item}
                <div class="item-count component">
                    <label for="count">数量 (count)</label>
                    <input type="number" class="input-number" id="count" bind:value={count} max={item.stackSize} min={1} on:input={refreshOutput} />
                </div>
                <div class="item-count component">
                    <label for="count">最大スタック数 (max_stack_size)</label>
                    <input type="number" class="input-number" id="count" bind:value={components.max_stack_size} min={1} on:input={refreshOutput} />
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
                        on:input={refreshOutput} />
                </div>
                {#if item.maxDurability}
                    <div class="item-damage component">
                        <label for="damage">Damage</label>
                        <input
                            type="number"
                            class="input-number"
                            id="damage"
                            bind:value={components.damage}
                            max={item.maxDurability}
                            min={0}
                            on:input={refreshOutput} />
                        <span>/{item.maxDurability}</span>
                    </div>
                {/if}
            {/if}
        </div>
    </Container>
</div>

<style>
.component {
    display: flex;
}
.component label {
    width: 200px;
}
.main {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
