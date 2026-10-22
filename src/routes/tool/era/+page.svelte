<script lang="ts">
    import Button from '$components/Button.svelte';
    import Container from '$components/Container.svelte';
    import Number from '$components/form/Number.svelte';
    import Select from '$components/form/Select.svelte';
    import { clamp } from '$lib/utils';
    import { DateTime, Interval } from 'luxon';
    import EraDialog from './EraDialog.svelte';
    import { jpEras } from './eras';

    let western: DateTime = $state(DateTime.local().startOf('day'));
    let age: number = $state(0);
    let selectJPEraDialog = $state(false);

    function handleUpdate() {
        const now = DateTime.local().endOf('day');
        if (now.diff(western.endOf('day')).toMillis() > 0) {
            const interval = Interval.fromDateTimes(western.endOf('day'), now);
            age = Math.floor(interval.toDuration('year').years);
        } else {
            const interval = Interval.fromDateTimes(now, western.endOf('day'));
            age = -Math.floor(interval.toDuration('year').years);
        }
    }
    function getEraName(): string {
        return jpEras.find((era) => Interval.fromDateTimes(era.start.startOf('day'), era.end.endOf('day')).contains(western))?.name || '';
    }
    function setEraName(name: string) {
        const era = jpEras.find((era) => era.name == name);
        if (!era) return;
        western = western.set({ year: era.start.year + getYearInEra() });
    }

    function getYearInEra(): number {
        const currentEra =
            jpEras.find((era) => Interval.fromDateTimes(era.start.startOf('day'), era.end.endOf('day')).contains(western)) || jpEras[0];
        const year = 1 + western.year - currentEra.start.year;
        return Math.max(1, year);
    }
    function setYearInEra(year: number) {
        if (year > 100000) return;
        const currentEra = jpEras.find((era) => Interval.fromDateTimes(era.start.startOf('day'), era.end.endOf('day')).contains(western));
        if (!currentEra && year <= 0) {
            year = 1;
            return;
        }
        if (!currentEra) return;
        western = DateTime.local(currentEra.start.year + year - 1, western.month, western.day);
    }
    const fix = (v: number) => clamp(v, 0, 10000);

    function handleAgeUpdate() {
        if (age != null) {
            const { year } = DateTime.local().startOf('day').minus({ years: age });
            western = western.set({ year: fix(year - 1) });
        }
    }

    function handleBirthdayUpdate() {
        handleAgeUpdate();
        handleUpdate();
    }
</script>

<EraDialog bind:shown={selectJPEraDialog} bind:value={() => getEraName(), (v) => setEraName(v)} />

<Container>
    <h1>歴・年齢変換</h1>
    <hr />
    <div class="main">
        <div>
            <span>西暦</span>
            <div class="era">
                <div>
                    <Number bind:value={() => western.year, (v) => (western = western.set({ year: fix(v) }))} oninput={handleUpdate} />
                    <span>年</span>
                </div>
                <div>
                    <Number bind:value={() => western.month, (v) => (western = western.set({ month: fix(v) }))} oninput={handleUpdate} />
                    <span>月</span>
                </div>
                <div>
                    <Number bind:value={() => western.day, (v) => (western = western.set({ day: fix(v) }))} oninput={handleUpdate} />
                    <span>日</span>
                </div>
            </div>
        </div>
        <div>
            {#if western.isValid && getEraName() != ''}
                <span>和暦</span>
                <div class="era">
                    <div>
                        <Select error={getEraName() == ''} bind:value={() => getEraName(), (v) => setEraName(v)} oninput={handleUpdate}>
                            {#if !jpEras
                                .slice(0, 5)
                                .map((e) => e.name)
                                .includes(getEraName())}
                                <option>{getEraName()}</option>
                            {/if}
                            {#each jpEras.slice(0, 5) as jpEraEntry}
                                <option>{jpEraEntry.name}</option>
                            {/each}
                        </Select>
                    </div>
                    <div>
                        <Number error={getEraName() == ''} bind:value={() => getYearInEra(), (v) => setYearInEra(fix(v))} oninput={handleUpdate} />
                        <span>年</span>
                    </div>
                    <div>
                        <Number bind:value={() => western.month, (v) => (western = western.set({ month: fix(v) }))} oninput={handleUpdate} />
                        <span>月</span>
                    </div>
                    <div>
                        <Number bind:value={() => western.day, (v) => (western = western.set({ day: fix(v) }))} oninput={handleUpdate} />
                        <span>日</span>
                    </div>
                </div>
            {:else}
                <span>和暦</span>
                <div>
                    <p class="error">変換できません</p>
                </div>
            {/if}
            <div>
                <Button inline onclick={() => (selectJPEraDialog = true)}>その他の元号を選択...</Button>
            </div>
        </div>
        <hr />
        <div>
            <span>年齢</span>
            <div class="era">
                <div>
                    <Number bind:value={() => age, (v) => (age = fix(v))} oninput={handleAgeUpdate} />
                    <span>歳</span>
                </div>
            </div>
            <div class="era">
                <span>誕生日</span>
                <div>
                    <Number bind:value={() => western.month, (v) => (western = western.set({ month: fix(v) }))} oninput={handleBirthdayUpdate} />
                    <span>月</span>
                </div>
                <div>
                    <Number bind:value={() => western.day, (v) => (western = western.set({ day: fix(v) }))} oninput={handleBirthdayUpdate} />
                    <span>日</span>
                </div>
            </div>
        </div>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .era {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .era > div {
        display: flex;
        flex-grow: 1;
        align-items: center;
    }
    .era > div > :global(div) {
        flex-grow: 1;
        margin: 5px 0;
    }
    .era > div > span {
        margin: 0 2px;
    }
    .error {
        color: #d33;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
