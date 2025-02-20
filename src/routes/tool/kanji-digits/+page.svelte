<script lang="ts">
    import Container from "$components/Container.svelte";
    import TextField from "$components/TextField.svelte";
    import { ActionResult } from "$lib/types";
    import { enumerate, isInteger, splitAll } from "$lib/utils";

    const kanji_digits = ["〇","一","二","三","四","五","六","七","八","九"]
    const kanji_units: Record<string, number> = {
        "万": 10000,
        "千": 1000,
        "百": 100,
        "十": 10
    }

    let kanji = "〇"
    let arabic = "0"

    function convertKanjiToArabic(val: string): ActionResult<number> {
        if (val == "") {
            return ActionResult.success(0)
        }

        let ret = 0
        
        for (const [i, v] of enumerate(val.split(""))) {
            const num = kanji_digits.lastIndexOf(v)
            if (num < 0) {
                return ActionResult.fail<number>(`文字「${v}」は漢数字ではありません`)
            }
            if (i == 0) {
                ret += num
            } else {
                ret += Math.pow(10, i) * num
            }
        }

        return ActionResult.success(ret)
    }

    function convertNumericKanjiToNumber(val: string): ActionResult<number> {
        const unit_keys = Object.keys(kanji_units)
        let ret = 0

        const parsed = splitAll(val, unit_keys)
        for (const unit of Object.keys(parsed)) {
            const v = parsed[unit]
            if (unit == "一") {
                const value = convertKanjiToArabic(v)
                if (value.is_error()) return value
                ret += value.get()
            } else {
                const multipiler = kanji_units[unit]
                if (v != "") {
                    const value = convertKanjiToArabic(v)
                    if (value.is_error()) return value
                    ret += multipiler * value.get()
                } else {
                    ret += multipiler
                }
            }            
        }

        return ActionResult.success(ret)
    }

    function convertArabicToKanji(val: number): ActionResult<string> {
        return kanji_digits[val] ? ActionResult.success(kanji_digits[val]) : ActionResult.fail("err1")
    }

    function convertArabicToNumericKanji(val: string): ActionResult<string> {
        let rets: string[] = []
        for (const [i, v] of enumerate(val.split("").toReversed())) {
            const num = Number.parseInt(v)
            const digit = Math.pow(10, i)
            const vi = i > 0 ? digit * num : num

            const dig_unit = Object.keys(kanji_units).find(k => kanji_units[k] == digit)

            let kanji_v = ""
            if (num > 1 || i > 3) {
                const kanji_v_res = convertArabicToKanji(num)
                if (kanji_v_res.is_error()) return kanji_v_res
                kanji_v = kanji_v_res.get()
            }

            if (i > 0) {
                if (vi > 1 && dig_unit) {
                    rets.push(`${kanji_v}${dig_unit}`)
                }
            } else {
                if (num > 0) {
                    const kanji_v_res = convertArabicToKanji(num)
                    if (kanji_v_res.is_error()) return kanji_v_res
                    kanji_v = kanji_v_res.get()                
                    rets.push(kanji_v)
                }
            }
        }

        const ret = rets.toReversed().join("")
        return ActionResult.success(ret)
    }

    function updateKanji() {
        arabic = convertNumericKanjiToNumber(kanji).get().toString()
    }

    function validateNumericKanji(val: string): ActionResult<number> {
        return convertNumericKanjiToNumber(val)
    }

    function updateArabic() {
        kanji = convertArabicToNumericKanji(arabic).get()
    }

    function validateArabic(val: string): ActionResult<string> {
        return isInteger(val) ? ActionResult.success("〇") : ActionResult.fail("数値エラー")
    }
</script>

<Container>
    <h1>漢数字変換</h1>
    <hr />
    <div class="main">
        <div>
            <p>漢数字</p>
            <TextField bind:value={kanji} on:update={updateKanji} validator={validateNumericKanji} copyable={true}/>
        </div>
        <div>
            <p>アラビア数字</p>
            <TextField bind:value={arabic} on:update={updateArabic} validator={validateArabic} copyable={true}  />
        </div>
    </div>
</Container>