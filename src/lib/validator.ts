import { ActionResult } from '$lib/action_result';

export type NumberRange = {
    min?: number;
    max?: number;
};

export function numberValidator(range?: NumberRange): Validator<number> {
    const { min, max } = range || {};
    return (v) => (v <= (max ? max : v) && v >= (min ? min : v) ? ActionResult.success(v) : ActionResult.fail(`無効な数値です。`));
}

export type Validator<V> = (val: V) => ActionResult<V>;
