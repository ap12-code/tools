<script lang="ts">
    import { onMount } from "svelte";
    import "$components/mctext.css";
    import type { Function0 } from "lodash";
    import type { Nullable, TextData, TextObject } from "$lib/data/types";
    let serialized: string = "";
    interface Props {
        data?: Nullable<TextData>;
        ok?: Nullable<Function0<void>>;
        update?: Nullable<Function0<void>>;
    }

    let { data = $bindable(), ok = null, update = null }: Props = $props();
    const elementId = crypto.randomUUID();

    function onInput() {
        data = serializeData();
        serialized = JSON.stringify(data);
        if (update) update();
    }
    function createNestedElementWithText(nodeNames: string[], text: string) {
        if (nodeNames.length == 1) return createElementWithText(nodeNames[0], text);
        let elm = document.createElement(nodeNames[0]);
        let lastElm = elm;
        for (let name of nodeNames.slice(1)) {
            const elm2 = document.createElement(name);
            elm = elm.appendChild(elm2);
            console.log(elm);
            lastElm = elm2;
        }
        lastElm.textContent = text;
        return elm;
    }
    function createElementWithText(nodeName: string, text: string) {
        const elm = document.createElement(nodeName);
        elm.textContent = text;
        return elm;
    }

    function applyTag(tagName: string, color?: string) {
        const element = document.getElementById(elementId);
        if (!element) return;
        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.getRangeAt(0).cloneRange();
        const nested: string[] = [tagName];
        for (let elm of element.childNodes) {
            if (range.intersectsNode(elm) && elm.nodeType != Node.TEXT_NODE) {
                nested.push(elm.nodeName.toLowerCase());
            }
        }
        const str = range.toString();
        range.deleteContents();
        const elm = createNestedElementWithText(nested.toReversed(), str);
        if (color) {
            elm.classList.add(`color-${color}`);
            elm.dataset.color = color;
        }

        range.insertNode(elm);
        onInput();
    }

    function applyBold() {
        applyTag("b");
    }
    function applyItalic() {
        applyTag("i");
    }
    function applyStrikeThrough() {
        applyTag("s");
    }
    function applyUnderline() {
        applyTag("u");
    }
    function applyColor(color: string) {
        applyTag("span", color);
    }

    function getParents(elm: Node) {
        const result: string[] = [];
        let parent = elm.parentNode;
        while (["B", "I", "S", "U"].includes(parent!.nodeName)) {
            result.push(parent!.nodeName);
            if (!parent?.parentNode) break;
            parent = parent?.parentNode;
        }
        return result;
    }
    function getColor(elm: HTMLElement) {
        let parent = elm;
        while (!(parent instanceof HTMLSpanElement)) {
            if (!parent?.parentElement) break;
            parent = parent.parentElement;
            if (parent instanceof HTMLDivElement) break;
        }
        return parent.dataset.color || undefined;
    }

    function _reSerializeData(data: TextObject[], elm: ChildNode | HTMLElement) {
        for (let e of Array.from(elm.childNodes)) {
            if (!e.textContent) continue;
            if (e.childNodes && e.nodeType !== Node.TEXT_NODE) {
                _reSerializeData(data, e);
            } else if (e.nodeType === Node.TEXT_NODE) {
                let color: Nullable<string> = undefined;
                if (elm instanceof HTMLElement) {
                    color = getColor(elm);
                }
                const parents = getParents(e);
                data.push({
                    text: e.textContent || "",
                    color: color,
                    bold: parents.includes("B") ? true : undefined,
                    italic: parents.includes("I") ? true : undefined,
                    strikethrough: parents.includes("S") ? true : undefined,
                    underline: parents.includes("U") ? true : undefined,
                });
            }
        }
    }

    function serializeData(): TextData {
        const element = document.getElementById(elementId);
        if (!element) return [];
        const result: TextObject[] = [];
        _reSerializeData(result, element);
        if (result.length == 1) {
            return result[0];
        }
        return result;
    }

    function _reDeserializeData(data: TextObject[]) {
        const element = document.getElementById(elementId);
        if (!element) return;
        for (let obj of data) {
            let nodes: string[] = [];
            if (obj.bold) nodes.push("B");
            if (obj.italic) nodes.push("I");
            if (obj.underline) nodes.push("U");
            if (obj.strikethrough) nodes.push("S");
            if (nodes.length == 0 && !obj.color) {
                element.appendChild(document.createTextNode(obj.text));
                continue;
            }
            const objNode = createNestedElementWithText(nodes, obj.text);
            if (obj.color) {
                objNode.classList.add(`color-${obj.color}`);
            }
            element.appendChild(objNode);
        }
    }

    function deserializeData(data: TextData) {
        if (data instanceof Array) {
            _reDeserializeData(data);
        } else if (typeof data === "string") {
            _reDeserializeData([{ text: data }]);
        } else {
            _reDeserializeData([data]);
        }
        onInput();
    }

    onMount(() => {
        if (data) {
            deserializeData(data);
        } else {
            onInput();
        }
    });
    const colors = [
        "black",
        "dark_blue",
        "dark_green",
        "dark_aqua",
        "dark_red",
        "dark_purple",
        "gold",
        "gray",
        "dark_gray",
        "blue",
        "green",
        "aqua",
        "red",
        "light_purple",
        "yellow",
        "white",
    ];
</script>

<div>
    <div class="toolbar">
        <button aria-label="太字" class="control" onclick={applyBold}><i class="bi bi-type-bold"></i></button>
        <button aria-label="斜体" class="control" onclick={applyItalic}><i class="bi bi-type-italic"></i></button>
        <button aria-label="取り消し線" class="control" onclick={applyStrikeThrough}><i class="bi bi-type-strikethrough"></i></button>
        <button aria-label="下線" class="control" onclick={applyUnderline}><i class="bi bi-type-underline"></i></button>
        {#each colors as color}
            <button aria-label="色" class="control" onclick={(_) => applyColor(color)}><i class={`bi bi-square-fill color-${color}`}></i></button>
        {/each}
    </div>
    <div contenteditable="true" role="textbox" spellcheck="false" class="main font-mc" id={elementId} oninput={onInput}></div>
    <div class="actions">
        {#if ok}
            <button onclick={ok} class="btn-confirm">閉じる</button>
        {/if}
    </div>
</div>

<style>
    .control {
        background-color: #222;
        border: #666 1px solid;
        border-radius: 5px;
        padding: 5px 7px;
        color: #fff;
    }
    .toolbar {
        display: flex;
        gap: 2px;
    }
    .main {
        user-select: text;
        white-space: pre-wrap;
        word-break: break-word;
        padding: 20px 10px;
        font-size: 18px;
        width: 50vw;
        margin: 5px 0;
        border-radius: 5px;
        background-color: #111;
    }
    .main:focus {
        outline: none;
    }
    .actions {
        display: flex;
        gap: 5px;
        padding: 5px 0;
    }
    .actions button {
        cursor: pointer;
        padding: 5px 40px;
        color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        transition: 0.3s;
    }
    .actions button.btn-confirm {
        background-color: #0a0;
    }
    .actions button.btn-confirm:hover {
        background-color: #070;
    }
</style>
