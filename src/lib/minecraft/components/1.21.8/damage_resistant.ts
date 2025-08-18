import { Component } from '../index.svelte';

export class DamageResistant implements Component<DamageResistant> {
    private types: string = '';

    public constructor() {}

    public serialize(): string {
        return JSON.stringify({
            types: this.types
        });
    }
    public deserialize(value: string): Component<DamageResistant> {
        const parsed = JSON.parse(value);
        this.types = parsed.types;
        return this;
    }

    public getTypes() {
        return this.types;
    }

    public setTypes(value: string) {
        this.types = value;
    }

    public get(): DamageResistant | undefined {
        return this;
    }
}
