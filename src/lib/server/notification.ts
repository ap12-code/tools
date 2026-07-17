import type { NotificationBody } from '$lib/notification';
import webpush from 'web-push';

const keys = {
    publicKey: 'BCW2UvZB-Ta-vKESvbzmR5-RAmQf2Bdc-7_E8rL8ELJBY6Uq74OkKXihEoCZEHamqHnxUr6ZkeMHOgtxouBLhJY',
    privateKey: 'g7d1jcIk1VnSuacD2hdBYpTWRGwE2S75EhinogepC9g'
};

export async function sendNotification(subscription: webpush.PushSubscription, body: NotificationBody) {
    webpush.setVapidDetails('mailto:ap12@ap12.net', keys.publicKey, keys.privateKey);
    const result = await webpush.sendNotification(subscription, JSON.stringify(body));
}
