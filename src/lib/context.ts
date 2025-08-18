import { SvelteMap } from 'svelte/reactivity';

export class DialogContext {
    private _map = new SvelteMap<string, boolean>();
}

export class Context {
    private _map = new SvelteMap();
}
