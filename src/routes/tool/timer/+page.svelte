<script lang="ts">
    import Button from '$components/Button.svelte';
    import Buttons from '$components/Buttons.svelte';
    import Container from '$components/Container.svelte';
    import Dialog from '$components/Dialog.svelte';
    import Icon from '@iconify/svelte';
    import { DateTime, Duration, type DurationLikeObject, type DurationUnit } from 'luxon';
    import { onMount } from 'svelte';
    import { loadTimers, type Timer } from '$lib/timer';
    import CheckBox from '$components/form/CheckBox.svelte';
    import { dev } from '$app/environment';

    let interval: NodeJS.Timeout | null = $state(null);
    let timers: Timer[] = $state([]);
    let push_notification: boolean | undefined = $state();
    let push_notification_error = $state(false);

    onMount(async () => {
        await navigator.serviceWorker.register('/service-worker.js', {
            type: dev ? 'module' : 'classic'
        });
    });
    function save() {
        for (let w of timers) {
            w.saved_at = DateTime.now();
        }
        localStorage.setItem('timer', JSON.stringify(timers));
    }
    async function loadPushNotification() {
        const registaration = await navigator.serviceWorker.ready;
        const permission = await registaration.pushManager.permissionState({
            userVisibleOnly: true
        });
        const state = permission === 'granted';
        if (!state) {
            updatePushNotification(false);
            return;
        }
        push_notification = localStorage.getItem('timer_notification') === 'true';
    }
    async function postUpdate(index: number) {
        if (!push_notification) return;

        const worker = await navigator.serviceWorker.ready;
        const subscription = await worker.pushManager.getSubscription();
        if (!subscription) return;

        const data = {
            timers: loadTimers().filter((t) => t.started),
            notification: subscription.toJSON(),
            index: index
        };
        if (!data.timers || !data.notification) return;
        const resp = await fetch('/api/notification/timer', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        console.log(await resp.json());
    }
    function load() {
        timers = loadTimers();
        loadPushNotification();

        if (interval == null) startInterval();
    }
    function resetData() {
        localStorage.removeItem('timer');
        save();
    }
    function checkUpdateEndAt(i: number) {
        const timer = timers[i];
        const old_end_at = timer.end_at;
        timer.end_at = DateTime.now().plus(timer.current);
        if (!old_end_at || !timer.end_at.hasSame(old_end_at, 'second')) {
            console.log('update end at: ' + timer.end_at.toISO());
            postUpdate(i);
        }
    }
    function startInterval() {
        interval = setInterval(() => {
            for (let i = 0; i < timers.length; i++) {
                const timer = timers[i];
                if (timer.current.as('seconds') < 1 && timer.started) {
                    stop(i);
                    if (timer.current.as('seconds') < -60) reset(i);
                } else if (timer.started && timer.started_at !== undefined && timer.start_time !== undefined && !timer.stopped) {
                    timer.current = timer.started_at.diffNow().plus(timer.start_time).normalize();
                    checkUpdateEndAt(i);
                    save();
                }
            }
        }, 10);
    }
    function reset(id: number) {
        if (!timers[id].started) {
            timers[id].duration = Duration.fromMillis(0);
        }
        timers[id].started = false;
        timers[id].stopped = false;
        timers[id].paused = false;
        timers[id].started_at = undefined;
        timers[id].end_at = undefined;
        timers[id].current = timers[id].duration;
        postUpdate(id);
        save();
    }
    function start(id: number) {
        timers[id].end_at = undefined;
        timers[id].started = true;
        timers[id].started_at = DateTime.now();
        timers[id].start_time = timers[id].duration;
        save();
    }
    function pause(id: number) {
        if (timers[id].paused) return;

        timers[id].paused = true;
        timers[id].started_at = undefined;
        timers[id].start_time = timers[id].current;
        timers[id].end_at = undefined;
        postUpdate(id);
        save();
    }
    function stop(id: number) {
        timers[id].stopped = true;
    }
    function resume(id: number) {
        if (!timers[id].paused) return;

        timers[id].started_at = DateTime.now();
        timers[id].paused = false;
        timers[id].end_at = undefined;
        checkUpdateEndAt(id);
        save();
    }
    function create() {
        timers.push({
            current: Duration.fromMillis(0),
            name: '',
            started: false,
            saved_at: DateTime.now(),
            duration: Duration.fromMillis(0),
            paused: false,
            stopped: false
        });
        timers = timers;
        save();
    }
    function del(index: number) {
        timers.splice(index, 1);
        timers = timers;
        save();
    }
    function updateTime(index: number, value: string) {
        if (!timers[index]) return;
        const match = value.replaceAll(':', '').slice(1).match(new RegExp('.{1,2}', 'g')) ?? [];
        const units: DurationUnit[] = ['hours', 'minutes', 'seconds'];
        const obj: DurationLikeObject = {};
        for (let i = 0; i < match.length; i++) {
            obj[units[i]] = parseInt(match[i]);
        }

        timers[index].duration = timers[index].duration.set(obj);
        timers[index].current = timers[index].duration.normalize();
        save();
    }
    async function updatePushNotification(value: boolean) {
        push_notification_error = false;
        if (value) {
            try {
                const worker = await navigator.serviceWorker.ready;
                const options = {
                    applicationServerKey: 'BCW2UvZB-Ta-vKESvbzmR5-RAmQf2Bdc-7_E8rL8ELJBY6Uq74OkKXihEoCZEHamqHnxUr6ZkeMHOgtxouBLhJY',
                    userVisibleOnly: true
                };
                const subscription = await worker.pushManager.subscribe(options);
                if (subscription === undefined) {
                    await updatePushNotification(false);
                    return;
                }
                localStorage.setItem('timer_notification', 'true');
            } catch (e) {
                console.log('Notification denined');
                push_notification_error = true;
                return;
            }
        } else {
            localStorage.removeItem('timer_notification');
        }
        push_notification = value;
    }
    onMount(load);
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
</svelte:head>

<Dialog title="エラー">
    <p>データのの読み込み中にエラーが発生しました。<br />使用するにはリセットを行う必要があります。</p>
    <Buttons>
        <Button onclick={resetData}>データリセット</Button>
    </Buttons>
</Dialog>

<Container>
    <h1>タイマー</h1>
    <p>データはブラウザのストレージに保存します。</p>
    <hr />
    {#if push_notification !== undefined}
        <div class="notification-control">
            <CheckBox bind:checked={() => push_notification!!, (v) => updatePushNotification(v)} onchange={() => {}} label="プッシュ通知を使用" />
            {#if push_notification_error}
                <br /><span>通知が許可されていません</span>
            {/if}
        </div>
    {/if}
    <br />
    <div class="counters">
        {#each timers as timer, index}
            <div class="counter border">
                <div class="title">
                    <input placeholder="タイトル" type="text" bind:value={timer.name} oninput={save} />
                </div>
                <div class="cn">
                    <div class="timer-input">
                        <input
                            type="text"
                            class="count"
                            bind:value={
                                () => timer.current.normalize().toFormat('hh:mm:ss'),
                                (v) => {
                                    updateTime(index, v);
                                }
                            }
                            readonly={timer.started}
                            class:finished={timer.stopped}
                            placeholder="00"
                        />
                    </div>
                    <br />
                </div>
                <div class="control">
                    {#if !timer.stopped && timer.duration.toMillis() > 1}
                        {#if timer.started && !timer.paused}
                            <button onclick={(_) => pause(index)}>一時停止</button>
                        {:else if timer.paused}
                            <button onclick={(_) => resume(index)}>再開</button>
                        {:else}
                            <button onclick={(_) => start(index)}>開始</button>
                        {/if}
                    {/if}
                    <button onclick={(_) => reset(index)}>リセット</button>
                    <button onclick={(_) => del(index)}>削除</button>
                </div>
            </div>
        {/each}
        <div class="add-button">
            <button onclick={create}><Icon icon="material-symbols:add" inline></Icon> 作成</button>
        </div>
    </div>
    {#if push_notification}
        <p class="notification-warning">
            プッシュ通知をONにしている場合、通知を行うため一時的にサーバーへ残り時間のデータが送信/保存されます。<br />
            保存されたデータは通知後に削除されます。<br />
            メンテナンス実施中・実施直後は通知が行われないことがあります。
        </p>
    {/if}
</Container>

<style>
    @keyframes finished {
        0% {
            color: #f88;
        }
        50% {
            color: white;
        }
        100% {
            color: #f88;
        }
    }
    .finished {
        animation: infinite finished 1s step-end;
    }
    .counters {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30px;
    }
    .counter.border {
        border: #666 1px solid;
        border-radius: 5px;
    }
    .counter {
        padding: 10px;
    }
    .control {
        display: flex;
        justify-content: center;
        gap: 10px;
        text-align: center;
    }
    .add-button {
        text-align: center;
    }
    .title {
        text-align: center;
    }
    .title > input {
        text-align: center;
    }
    .count {
        font-size: max(5vw, 60px);
        text-align: center;
        font-family: 'Share Tech Mono', monospace;
    }
    .cn {
        text-align: center;
    }
    button {
        padding: 5px;
        background-color: #222;
        width: 100px;
        border: #666 1px solid;
        border-radius: 5px;
        color: #fff;
        height: 32px;
        transition: 0.2s all;
    }
    button:hover {
        background-color: #666;
        transition: 0.2s all;
        cursor: pointer;
    }
    input {
        outline: none;
        background-color: #222;
        padding: 5px;
        border: none;
        border-radius: 5px;
        color: #fff;
    }
    .timer-input {
        display: flex;
        justify-content: center;
    }
    .notification-warning {
        color: #ddd;
    }
    .notification-control {
        text-align: right;
    }
</style>
