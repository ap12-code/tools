import type { Component } from '$lib/minecraft/components/index.svelte';

export class BooleanComponent {
    private value: boolean = false;

    public constructor() {}

    public serialize(): string {
        return this.value.toString();
    }

    public deserialize(value?: string): Component<BooleanComponent> {
        if (value) this.value = Boolean(value);
        return this;
    }

    public get(): BooleanComponent {
        return this;
    }

    public getValue() {
        return this.value;
    }

    public setValue(value: boolean) {
        this.value = value;
    }
}
