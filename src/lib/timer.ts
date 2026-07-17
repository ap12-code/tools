import { browser, dev } from '$app/environment';
import { DateTime, Duration } from 'luxon';

export type Timer = {
    name: string;
    duration: Duration;
    started: boolean;
    paused: boolean;
    current: Duration;
    started_at?: DateTime;
    start_time?: Duration;
    saved_at: DateTime;
    stopped: boolean;
    end_at?: DateTime;
};

const serializedKeys = ['duration', 'current', 'started_at', 'start_time', 'saved_at', 'end_at'] as const;
export type SavedTimer = Omit<Timer, (typeof serializedKeys)[number]> & {
    duration: string;
    current: string;
    started_at?: string;
    saved_at: string;
};

export function loadTimers(): Timer[] {
    const timers: Timer[] = [];
    const loaded: SavedTimer[] = JSON.parse(localStorage.getItem('timer') || '[]');
    for (let data of loaded) {
        const parsed: Record<string, any> = {};
        for (const key of Object.keys(data) as Array<keyof SavedTimer>) {
            const value = data[key];
            if (Array.from<string>(serializedKeys.values()).includes(key)) {
                if (typeof value === 'string' && value.startsWith('P')) {
                    parsed[key] = Duration.fromISO(value);
                } else if (typeof value === 'string') {
                    parsed[key] = DateTime.fromISO(value);
                }
            } else {
                parsed[key] = value;
            }
        }
        timers.push(parsed as Timer);
    }
    return timers;
}

export async function subscribe() {
    if (!browser) return;
    if ('serviceWorker' in navigator) {
        const worker = await navigator.serviceWorker.register('/service-worker.js', {
            type: dev ? 'module' : 'classic'
        });
        const subscription = await worker.pushManager.subscribe({
            applicationServerKey: 'BCW2UvZB-Ta-vKESvbzmR5-RAmQf2Bdc-7_E8rL8ELJBY6Uq74OkKXihEoCZEHamqHnxUr6ZkeMHOgtxouBLhJY',
            userVisibleOnly: true
        });
    }
}
