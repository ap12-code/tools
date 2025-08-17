import type { TextArray, TextData, TextObject } from "$lib/minecraft/types"
import type { Component } from "$lib/minecraft/components/index.svelte"

export type RawText = TextObject | TextArray

export class ComponentText {
    private value: TextData = ""

    public constructor() {
    }

    public serialize(): string {
        return JSON.stringify(this.value)
    }

    public deserialize(value: string): Component<ComponentText> {
        this.value = JSON.parse(value)
        return this
    }

    public get(): ComponentText | undefined {
        return this
    }

    public setText(value?: TextData) {
        if (value) this.value = value
    }
    public getText() {
        return this.value
    }
}