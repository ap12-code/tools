// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import '$service-worker';
type NotificationBody = {
    title: string;
    body: string;
};

const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

self.onpush = async (event) => {
    const data: NotificationBody = await event.data?.json();

    self.registration.showNotification(data.title, {
        body: data.body
    });
};
