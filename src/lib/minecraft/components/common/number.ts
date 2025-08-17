import type { Component } from "$lib/minecraft/components/index.svelte"

export class NumberComponent {
    private value: number = 0

    public constructor() {
    }

    public serialize(): string {
        return this.value.toString()
    }

    public deserialize(value?: string): Component<NumberComponent> {
        if (value) this.value = Number.parseInt(value)
        return this
    }

    public get(): NumberComponent {
        return this
    }

    public getValue() {
        return this.value
    }

    public setValue(value: number) {
        this.value = value
    }
}