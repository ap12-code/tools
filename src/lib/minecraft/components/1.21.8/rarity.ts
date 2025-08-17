import type { Component } from "$lib/minecraft/components/index.svelte";

export class Rarity {
    private static KEYS: Set<Rarity> = new Set();

    public static readonly COMMON = new Rarity("common")
    public static readonly UNCOMMON = new Rarity("uncommon")
    public static readonly RARE = new Rarity("rare")
    public static readonly EPIC = new Rarity("epic")

    private value: string | undefined
    public constructor(value?: string) {
        if (value) {
            this.value = value;
            Rarity.KEYS.add(this)
        }
    }

    public static valueOf(value: string): Rarity | undefined {
        return Array.from(Rarity.KEYS).find(v => v.value?.toLowerCase() == (value || "").toLowerCase());
    }

    public static values() {
        return Array.from(Rarity.KEYS)
    }

    public serialize(): string {
        return this.value || ""
    }

    public deserialize(value: string): Component<Rarity> {
        this.value = Rarity.valueOf(value)?.value;
        return this;
    }

    public get(): Rarity | undefined {
        return this
    }


    public toString() {
        return this.value
    }
}