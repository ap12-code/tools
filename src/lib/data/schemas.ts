type Nullable<T> = T | null | undefined;

type ComponentMap = {
    [k: string]: any;
};

type TextClickEvent = {
    action: string;
    value: number | string;
};

type TextHoverEventItemContent = {
    id: string;
    count: Nullable<number>;
    components?: Nullable<ComponentMap>;
};

type TextHoverEventEntityContent = {
    name: Nullable<string>;
    type: Nullable<string>;
    id: Nullable<string>;
};

type TextHoverEvent = {
    action: string;
    contents: string | TextHoverEventItemContent | TextHoverEventEntityContent;
};

type TextObject = {
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

type TextData = TextObject[] | TextObject | string;

type Item = {
    id: string;
    translation_key: string;
    max_stack_size: number;
    max_damage?: number;
    tags: string[];
};
