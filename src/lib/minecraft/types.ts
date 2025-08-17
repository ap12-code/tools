import type { ComponentMap } from "$lib/minecraft/components/index.svelte";

export type Nullable<T> = T | null | undefined;
export type TrueOrNull = undefined | null | {};

export type TextClickEvent = {
    action: string;
    value: number | string;
};

export type TextHoverEventItemContent = {
    id: string;
    count: Nullable<number>;
    components?: Nullable<ComponentMap>;
};

export type TextHoverEventEntityContent = {
    name: Nullable<string>;
    type: Nullable<string>;
    id: Nullable<string>;
};

export type TextHoverEvent = {
    action: string;
    contents: string | TextHoverEventItemContent | TextHoverEventEntityContent;
};

export type TextObject = {
    text: string;
    color?: Nullable<string>;
    font?: Nullable<string>;
    bold?: Nullable<boolean>;
    italic?: Nullable<boolean>;
    underline?: Nullable<boolean>;
    strikethrough?: Nullable<boolean>;
    obfuscated?: Nullable<boolean>;
    click_event?: Nullable<TextClickEvent>;
    hover_event?: Nullable<TextHoverEvent>;
};
export type TextArray = TextObject[]
export type TextData = TextArray | TextObject | string;

export type Item = {
    id: string;
    translation_key: string;
    max_stack_size: number;
    max_damage?: number;
    tags: string[];
};

export type ItemStack = {
    item: Item;
    count: number;
    components: Nullable<ComponentMap>;
};
