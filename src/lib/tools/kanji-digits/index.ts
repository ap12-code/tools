import { ActionResult } from '$lib/action_result';
import { enumerate } from '$lib/utils';

export const kanji_digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
export const kanji_units: Record<string, number> = {
    億: 100000000,
    万: 10000,
    千: 1000,
    百: 100,
    十: 10
};

export function convertKanjiToArabic(val: string) {
    if (val == '') {
        return ActionResult.success(0);
    }

    let ret = 0;

    for (const [i, v] of enumerate(val.split(''))) {
        const num = kanji_digits.lastIndexOf(v);
        if (num < 0) {
            return ActionResult.fail<number>(`文字「${v}」は漢数字ではありません`);
        }
        if (i == 0) {
            ret += num;
        } else {
            ret += Math.pow(10, i) * num;
        }
    }

    return ActionResult.success(ret);
}
