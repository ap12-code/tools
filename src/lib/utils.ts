import type { TextObject, TextData } from "./minecraft/types";

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

const integer_pattern = /^[0-9]+$/;
export function isInteger(val: string): boolean {
    return integer_pattern.test(val);
}

export function enumerate<T>(data: T[]): [number, T][] {
    return data.map((k, i) => [i, k]);
}

export function splitAll(text: string, sep: string[]): Record<string, string> {
    let buf = "";
    let ret: Record<string, string> = {};

    for (const c of text.split("")) {
        if (sep.includes(c)) {
            ret[c] = buf;
            buf = "";
        } else {
            buf += c;
        }
    }

    ret["一"] = buf;
    return ret;
}

export function range(a1: number, a2?: number, a3?: number): number[] {
    const ret: number[] = [];
    if (!a2 && !a3) {
        for (let i = 0; i < a1; i++) {
            ret.push(i);
        }
    } else if (a1 && a2) {
        for (let i = a1; i < a2; i++) {
            ret.push(i);
        }
    } else if (a1 && a2 && a3) {
        for (let i = a1; i < a2; i += a3) {
            ret.push(i);
        }
    }
    return ret;
}
