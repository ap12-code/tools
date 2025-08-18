<script lang="ts">
    import Container from '$components/Container.svelte';
    import Text from '$components/form/Text.svelte';
    import { ActionResult } from '$lib/action_result';
    import { StringReader } from '$lib/reader';
    import { isInteger } from '$lib/utils';
    import Decimal from 'decimal.js';

    const kanji_digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const kanji_subunits: Record<string, number> = {
        千: 1000,
        百: 100,
        十: 10,
        一: 1
    };
    const kanji_units: Record<string, number> = {
        億: 100000000,
        万: 10000,
        千: 1000,
        百: 100,
        十: 10
    };

    let kanji = $state('〇');
    let arabic = $state('0');

    function _convertKanjiToArabicSub(val: string): ActionResult<string> {
        if (val == '') {
            return ActionResult.success('0');
        }

        let ret = 0;
        const reader = new StringReader(val);

        for (const [unit, unitMul] of Object.entries(kanji_subunits)) {
            if (!reader.getRemaining().includes(unit)) continue;

            const unitValue = reader.readStringUntil(unit);
            if (unitValue == '' && unit) {
                ret += unitMul;
                break;
            }

            let unitValueNumber = kanji_digits.lastIndexOf(unitValue);
            if (unitValueNumber == -1) {
                unitValueNumber = Object.entries(kanji_subunits).find(([k, v]) => k == unitValue)?.[1] || -1;
            }
            if (unitValueNumber == -1) {
                return ActionResult.fail(`単位「${unit}」付近に無効な値があります: ${unitValue}`);
            }
            ret += unitMul * unitValueNumber;
        }
        const remaining = reader.getRemaining();
        if (remaining) {
            ret += kanji_digits.lastIndexOf(remaining);
        }

        return ActionResult.success(ret.toString());
    }

    function convertKanjiToArabic(val: string): ActionResult<string> {
        if (val == '') {
            return ActionResult.success('0');
        }

        let ret = 0;
        const reader = new StringReader(val);

        for (const [unit, unitMul] of Object.entries(kanji_units)) {
            if (!reader.getRemaining().includes(unit)) continue;

            const unitValue = reader.readStringUntil(unit);

            let unitValueNumber = _convertKanjiToArabicSub(unitValue);
            if (unitValueNumber.is_error()) return unitValueNumber;

            ret += unitMul * Number.parseInt(unitValueNumber.get());
        }
        const remaining = reader.getRemaining();
        if (remaining) {
            ret += kanji_digits.lastIndexOf(remaining);
        }

        return ActionResult.success(ret.toString());
    }

    function _convertArabicToKanjiSub(val: string): ActionResult<string> {
        let rets: string[] = [];
        const numValue = Number.parseInt(val);
        let remaining = numValue;
        if (numValue >= 10000) {
            return ActionResult.fail('対応していない漢数字変換です(範囲: 1～999999999999)');
        }
        for (const [unit, mul] of Object.entries(kanji_subunits)) {
            if (remaining / mul >= 1) {
                let v = kanji_digits[Math.floor(remaining / mul)];
                if (v == '一') v = '';
                rets.push(`${v}${unit != '一' ? unit : ''}`);
                remaining = remaining % mul;
            }
        }

        const ret = rets.join('');
        return ActionResult.success(ret);
    }

    function convertArabicToKanji(val: string): ActionResult<string> {
        let rets: string[] = [];
        const numValue = Number.parseInt(val);
        let remaining = numValue;
        for (const [unit, mul] of Object.entries(kanji_units)) {
            if (remaining / mul >= 1) {
                let v = '';
                if (Math.floor(remaining / mul) != 1) {
                    const ar_v = _convertArabicToKanjiSub(Math.floor(remaining / mul).toString());
                    if (ar_v.is_error()) return ar_v;
                    v = ar_v.get();
                }
                if (v == '' && !Object.keys(kanji_subunits).includes(unit)) {
                    v = '一';
                }
                rets.push(`${v}${unit}`);
                remaining = remaining % mul;
            }
        }
        if (remaining != 0) {
            rets.push(`${kanji_digits[remaining]}`);
        }

        let ret = rets.join('');

        return ActionResult.success(ret);
    }

    function fixKanji() {}

    function updateKanji() {
        arabic = convertKanjiToArabic(kanji).get().toString();
    }

    function validateNumericKanji(val: string): ActionResult<string> {
        const result = convertKanjiToArabic(val);
        if (result.is_error()) return result;
        return result.get() == '-1' || result.get() == '' ? ActionResult.fail('変換可能範囲外または数値が認識できません') : result;
    }

    function updateArabic() {
        kanji = convertArabicToKanji(arabic).get();
    }

    function validateArabic(val: string): ActionResult<string> {
        if (!isInteger(val)) return ActionResult.fail(`数値 ${val} を認識できません`);
        if (Number.parseInt(val) < 0) return ActionResult.fail(`数値 ${val} は変換範囲外です。`);
        if (Number.parseInt(val) >= 1000000000000) return ActionResult.fail(`数値 ${val} は変換範囲外です。`);

        return ActionResult.success('〇');
    }
</script>

<Container>
    <h1>漢数字変換</h1>
    <span>そのうちローマ数字も増やします</span>
    <hr />
    <div class="main">
        <div>
            <Text bind:value={kanji} oninput={updateKanji} validator={validateNumericKanji} copyable={true} label="漢数字" />
        </div>
        <div>
            <Text bind:value={arabic} oninput={updateArabic} validator={validateArabic} copyable={true} label="アラビア数字" />
        </div>
    </div>
</Container>
