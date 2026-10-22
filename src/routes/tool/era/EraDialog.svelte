<script lang="ts">
    import Button from '$components/Button.svelte';
    import Buttons from '$components/Buttons.svelte';
    import Dialog from '$components/Dialog.svelte';
    import CheckBox from '$components/form/CheckBox.svelte';
    import { SvelteMap } from 'svelte/reactivity';
    import { jpEras, periods } from './eras';
    import { DateTime, Interval } from 'luxon';
    import Number from '$components/form/Number.svelte';

    let eras = $state(jpEras);

    type Eras = (typeof periods)[number]['name'];
    let periodFilter: SvelteMap<Eras, boolean> = new SvelteMap();
    for (const period of periods.map((e) => e.name)) periodFilter.set(period, true);

    let startYear = $state(0);
    let endYear = $state(0);
    let ranged = $state(false);

    type Props = {
        value: string;
        shown: boolean;
    };
    let { value = $bindable(), shown = $bindable(false) }: Props = $props();

    function updateFilter() {
        eras = [];
        for (const periodKey of Array.from(periodFilter.keys()).toReversed()) {
            const periodIndex = periods.findIndex((p) => p.name == periodKey);
            if (periodIndex == -1) return;
            const period = periods[periodIndex];

            if (!periodFilter.get(period.name)) continue;

            eras.push(...jpEras.filter((e) => Interval.fromDateTimes(period.start, period.end).contains(e.start)));
        }

        if (ranged) {
            if (endYear < startYear) endYear = startYear;
            if (startYear == 0) startYear = endYear;
            if (startYear > 0 && endYear > 0) {
                const start = DateTime.local(startYear).startOf('year');
                const end = DateTime.local(endYear).endOf('year');
                eras = eras.filter((e) => Interval.fromDateTimes(start, end).intersection(Interval.fromDateTimes(e.start, e.end)));
            }
        } else if (endYear != 0) {
            const start = DateTime.local(endYear).startOf('year');
            eras = eras.filter((e) => Interval.fromDateTimes(e.start.startOf('day'), e.end.endOf('day')).contains(start));
        }
    }

    function resetAllFilter() {
        for (const period of periods.map((e) => e.name)) periodFilter.set(period, true);
        startYear = 0;
        endYear = 0;
        ranged = false;
        value = jpEras.at(0)!.name;
        updateFilter();
    }

    function selectAll() {
        for (const period of periods.map((e) => e.name)) periodFilter.set(period, true);
        updateFilter();
    }

    function deselectAll() {
        for (const period of periods.map((e) => e.name)) periodFilter.set(period, false);
        updateFilter();
    }

    function clearYearFilter() {
        startYear = 0;
        endYear = 0;
        updateFilter();
    }
</script>

<Dialog bind:show={shown} title="その他の元号を選択...">
    <div class="eras">
        {#if eras.length}
            {#each eras.toReversed() as era}
                <div>
                    <label>
                        <input type="radio" name="era" value={era.name} bind:group={value} />
                        {era.name}
                    </label>
                </div>
            {/each}
        {:else}
            <p>当てはまる元号がありません。</p>
        {/if}
    </div>
    <div>
        <p>時代でフィルタ</p>
        {#each periods as period}
            <CheckBox
                label={period.name}
                bind:checked={() => periodFilter.get(period.name) ?? false, (v) => periodFilter.set(period.name, v)}
                onchange={updateFilter}
            />
        {/each}
        <div>
            <Button inline onclick={deselectAll}>全解除</Button>
            <Button inline onclick={selectAll}>全選択</Button>
        </div>
    </div>
    <div>
        <p>西暦でフィルタ</p>
        <div class="western">
            {#if ranged}
                <Number placeholder="開始年(西暦)" bind:value={startYear} oninput={updateFilter} />
                ～
                <Number placeholder="終了年(西暦)" bind:value={endYear} oninput={updateFilter} />
            {:else}
                <Number placeholder="年(西暦)" bind:value={endYear} oninput={updateFilter} />
            {/if}
            <div>
                <Button inline onclick={clearYearFilter}>解除</Button>
            </div>
            <CheckBox label="範囲" bind:checked={ranged} />
        </div>
    </div>
    <hr />
    <div>
        <Buttons>
            <Button onclick={() => (shown = false)}>OK</Button>
            <Button onclick={resetAllFilter}>リセット</Button>
        </Buttons>
    </div>
</Dialog>

<style>
    .eras {
        display: grid;
        grid-template-rows: repeat(20, 1fr);
        grid-auto-flow: column;
        min-height: 480px;
    }
    .western {
        display: flex;
        gap: 5px;
        align-items: center;
    }
</style>
