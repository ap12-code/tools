import type { TextObject, TextData } from "./data/types";

export function isTextObject(val: any): val is TextObject {
    return val.text != undefined;
}

export function isTextArray(val: any): val is TextObject[] {
    if (Array.isArray(val)) {
        if (val.length == 0) return true;
        return val[0].text != undefined;
    }
    return false;
}

export function isTextData(val: any): val is TextData {
    return isTextArray(val) || isTextObject(val);
}
