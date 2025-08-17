import type { Component } from "../index.svelte"

export class Food {
    private nutrition: number = 0
    private saturation: number = 0
    private can_always_eat: boolean = false

    public constructor() {

    }

    public serialize(): string {
        return JSON.stringify({
            nutrition: this.nutrition,
            saturation: this.saturation,
            can_always_eat: this.can_always_eat
        })
    }
    public deserialize(value?: string): Component<Food> {
        if (value) {
            const parsed = JSON.parse(value)
            this.nutrition = parsed.nutrition
            this.saturation = parsed.saturation
            this.can_always_eat = parsed.can_always_eat
        }
        return this
    }
    public get(): Food | undefined {
        return this
    }

    public getNutrition() {
        return this.nutrition
    }

    public getSaturation() {
        return this.saturation
    }

    public getCanAlwaysEat() {
        return this.can_always_eat
    }

    public setNutrition(v: number) {
        this.nutrition = v
    }

    public setSaturation(v: number) {
        this.saturation = v
    }

    public setCanAlwaysEat(v: boolean) {
        this.can_always_eat = v
    }
}