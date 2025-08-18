import type { Component } from '$lib/minecraft/components/index.svelte';
import type { Nullable } from '$lib/minecraft/types';

export class ConsumableAnimation {}

export class ConsumableEffectsRemoveEffect {
    private effects: string[] = [];

    public constructor() {}

    public serialize() {
        return JSON.stringify({
            type: 'minecraft:remove_effects',
            effects: this.effects
        });
    }
    public deserialize(value?: string) {
        if (value) this.effects = JSON.parse(value);
    }
    public getEffects() {
        return this.effects;
    }
}

export class Effect {
    private id: string = '';
    private amplifier: number = 1;
    private duration: number = 1;

    public constructor() {}

    public serialize() {
        return JSON.stringify({
            id: this.id,
            amplifier: this.amplifier,
            duration: this.duration
        });
    }

    public toJSON() {
        return this.serialize();
    }

    public deserialize(value?: string) {
        if (value) {
            const parsed = JSON.parse(value);
            this.id = parsed.id;
            this.amplifier = parsed.amplifier;
            this.duration = parsed.duration;
        }
    }

    public getId() {
        return this.id;
    }

    public getAmplifier() {
        return this.amplifier;
    }

    public getDuration() {
        return this.duration;
    }

    public setId(id: string) {
        this.id = id;
    }

    public setAmplifier(amplifier: number) {
        this.amplifier = amplifier;
    }

    public setDuration(duration: number) {
        this.duration = duration;
    }
}

export class ConsumableEffectsApplyEffect {
    private effects: Effect[] = [];

    public constructor() {}

    public serialize() {
        return JSON.stringify({
            type: 'minecraft:apply_effects',
            effects: this.effects
        });
    }

    public toJSON() {
        return this.serialize();
    }

    public deserialize(value?: string) {
        if (value) this.effects = JSON.parse(value);
    }

    public getEffects() {
        return this.effects;
    }
}

export class ConsumableEffects {}

export class Consumable implements Component<Consumable> {
    private consume_seconds: Nullable<number>;
    private animation: Nullable<ConsumableAnimation>;
    private sound_event: Nullable<string>;
    private has_consume_particles: Nullable<boolean>;

    public constructor() {}

    public serialize(): string {
        throw new Error('Method not implemented.');
    }
    public deserialize(value?: string): Component<Consumable> {
        throw new Error('Method not implemented.');
    }
    public get(): Consumable | undefined {
        throw new Error('Method not implemented.');
    }
}
