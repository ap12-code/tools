<script lang="ts">
    import { onMount } from "svelte";
    import "$components/mctext.css";
    import type { Function0 } from "lodash";
    import type { Nullable, TextData, TextObject } from "$lib/minecraft/types";
    import { isTextArray } from "$lib/utils";

    let serialized: string = "";

    interface Props {
        data?: Nullable<TextData>;
        ok?: Nullable<Function0<void>>;
        update?: Nullable<Function0<void>>;
    }

    let { data = $bindable(), ok = null, update = null }: Props = $props();
    const elementId = crypto.randomUUID();

    function onInput() {
        data = compactData(serializeData());
        serialized = JSON.stringify(data);
        if (update) update();
    }

    function compactData(data: TextData) {
        if (data instanceof Array) {
            return data[0];
        }
        return data;
    }

    function createNestedElementWithText(nodeNames: string[], text: string) {
        if (nodeNames.length == 1) return createElementWithText(nodeNames[0], text);
        let rootElement = document.createElement(nodeNames[0]);
        let lastElm = rootElement;
        for (let name of nodeNames.slice(1)) {
            const childElmement = document.createElement(name);
            lastElm.appendChild(childElmement);
            lastElm = childElmement;
        }
        lastElm.textContent = text;
        return rootElement;
    }

    function createElementWithText(nodeName: string, text: string) {
        const elm = document.createElement(nodeName);
        elm.textContent = text;
        return elm;
    }

    function applyReset() {
        applyColor("reset");

        let serialized = serializeData();
        if (isTextArray(serialized)) {
            serialized.forEach((_, i) => {
                if (serialized[i].color == "reset") {
                    serialized[i] = { text: serialized[i].text };
                }
            });
        }
        clearData();
        deserializeData(serialized);
    }

    function applyTag(tagName: string, color?: string) {
        const element = document.getElementById(elementId);
        if (!element) return;
        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.getRangeAt(0).cloneRange();

        const str = range.toString();
        range.deleteContents();

        const elm = createElementWithText(tagName, str);
        if (color) {
            elm.classList.add(`color-${color}`);
            elm.dataset.color = color;
        }
        range.insertNode(elm);

        selection.removeAllRanges();
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
        let parent = elm;
        while (["b", "i", "s", "u", "span"].includes(parent!.nodeName.toLowerCase())) {
            const nodeName = parent!.nodeName.toLowerCase();
            if (nodeName != "span") {
                result.push(nodeName);
            }
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

    function clearData() {
        const element = document.getElementById(elementId);
        if (!element) return;
        Array.from(element.children).forEach((elm) => elm.remove());
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
                const parents = getParents(elm);
                data.push({
                    text: e.textContent || "",
                    color: color,
                    bold: parents.includes("b") ? true : undefined,
                    italic: parents.includes("i") ? true : undefined,
                    strikethrough: parents.includes("s") ? true : undefined,
                    underline: parents.includes("u") ? true : undefined,
                });
            }
        }
    }

    function serializeData(): TextData {
        const element = document.getElementById(elementId);
        if (!element) return [];
        const result: TextObject[] = [];
        _reSerializeData(result, element);
        if (result.length == 0) {
            return "";
        }
        return result;
    }

    function _reDeserializeData(data: TextObject[]) {
        const element = document.getElementById(elementId);
        if (!element) return;

        for (let obj of data) {
            let nodes: string[] = [];

            if (obj.bold) nodes.push("b");
            if (obj.italic) nodes.push("i");
            if (obj.underline) nodes.push("u");
            if (obj.strikethrough) nodes.push("s");
            if (obj.color) nodes.push("span");

            const objNode = createNestedElementWithText(nodes.toReversed(), obj.text);

            if (obj.color) {
                objNode.classList.add(`color-${obj.color}`);
                objNode.dataset.color = obj.color;
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

    function reload() {
        const serialized = serializeData();

        clearData();
        deserializeData(serialized);
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
        <button aria-label="太字" class="control" onclick={applyBold}><span class="icon fill">format_bold</span></button>
        <button aria-label="斜体" class="control" onclick={applyItalic}><span class="icon fill">format_italic</span></button>
        <button aria-label="取り消し線" class="control" onclick={applyStrikeThrough}><span class="icon fill">format_strikethrough</span></button>
        <button aria-label="下線" class="control" onclick={applyUnderline}><span class="icon fill">format_underlined</span></button>
        <button aria-label="リセット" class="control" onclick={applyReset}><span class="icon fill">format_clear</span></button>
        {#each colors as color}
            <button aria-label="色" class="control" onclick={(_) => applyColor(color)}>
                <span class={`color-${color}`}><span class={`icon fill`}>square</span></span>
            </button>
        {/each}
        <button aria-label="リロード" class="control" onclick={reload}><span class="icon fill">sync</span></button>
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
        cursor: pointer;
        transition: 0.1s;
        background-color: #222;
        border: #666 1px solid;
        border-radius: 5px;
        padding: 5px 7px;
        color: #fff;
    }
    .control:hover {
        background-color: #444;
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
