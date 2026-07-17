import { isJsonString } from '$lib/utils';
import { json, type RequestHandler } from '@sveltejs/kit';
import { DateTime, Duration, type DurationLikeObject, type DurationObjectUnits, type DurationUnit } from 'luxon';
import z from 'zod';
import _ from 'lodash';
import { sendNotification } from '$lib/server/notification';

const notificationScheme = z.object({
    endpoint: z.url({ protocol: /https/ }),
    expirationTime: z.int().nullable(),
    keys: z.object({
        p256dh: z.string(),
        auth: z.string()
    })
});
const timerScheme = z.object({
    name: z.string(),
    duration: z.string(),
    started: z.boolean(),
    paused: z.boolean(),
    current: z.string(),
    started_at: z.string().optional(),
    start_time: z.string().optional(),
    saved_at: z.string(),
    stopped: z.boolean(),
    end_at: z.string().optional()
});

const requestScheme = z.object({
    timers: z.array(timerScheme),
    notification: notificationScheme,
    index: z.int()
});

type ScheduledNotification = {
    notification: z.infer<typeof notificationScheme>;
    at: DateTime;
    index: number;
    title: string;
};

let schedules: ScheduledNotification[] = [];
setInterval(() => {
    for (const schedule of schedules) {
        if (schedule.at.diffNow('second').toMillis() < 1000) {
            sendNotification(schedule.notification, {
                title: 'タイマーの終了',
                body: `${schedule.title}が終了しました`
            });
            _.remove(schedules, schedule);
        }
    }
}, 500);

type Timer = z.infer<typeof timerScheme>;
type DurationUnit2 = keyof DurationObjectUnits;

const durationUnitMap: Partial<Record<DurationUnit2, [string, number]>> = {
    years: ['年', 0],
    months: ['ヶ月', 1],
    days: ['日', 2],
    hours: ['時間', 3],
    minutes: ['分', 4],
    seconds: ['秒', 5]
};

function createTitle(timer: Timer): string {
    if (timer.name) return `タイマー「${timer.name}」`;
    const duration = Duration.fromISO(timer.duration).toObject();
    let durationParsed: Record<number, string> = {};
    for (const key of Object.keys(duration) as DurationUnit2[]) {
        const [jp, i] = durationUnitMap[key]!!;
        durationParsed[i] = `${duration[key]}${jp}`;
    }
    return `タイマー(${_.sortBy(durationParsed).toReversed().join('')})`;
}

export const POST: RequestHandler = async ({ request }) => {
    const rawBody = await request.text();
    if (!isJsonString(rawBody)) {
        return json({ error: 'invalid json' }, { status: 422 });
    }
    const parsed = z.safeParse(requestScheme, JSON.parse(rawBody));
    if (!parsed.success) {
        return json({ error: parsed.error.issues }, { status: 422 });
    }
    const data = parsed.data;

    if (!(data.index in data.timers) || !data.timers[data.index].started || data.timers[data.index].stopped || data.timers[data.index].paused) {
        const result = _.remove(schedules, { index: data.index, notification: data.notification });
        if (result.length == 0) {
            return json({ message: 'Already removed scheduled notification' });
        }
        return json({ message: 'Removed scheduled notification' });
    }

    const end_at = data.timers[data.index].end_at;
    if (!end_at) {
        return json({ error: 'invalid end time' }, { status: 400 });
    }
    if (schedules.find((p) => p.notification == data.notification && p.index == data.index)) {
        _.remove(schedules, { index: data.index, notification: data.notification });
    }

    schedules.push({
        notification: data.notification,
        at: DateTime.fromISO(end_at),
        index: data.index,
        title: createTitle(data.timers[data.index])
    });

    return json({ message: 'Successfully scheduled notification' });
};
