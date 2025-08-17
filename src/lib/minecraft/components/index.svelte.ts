import type { Consumer } from "$lib/functions";
import { SvelteMap } from "svelte/reactivity";
import { Rarity, DamageResistant, Food, TooltipDisplay } from "$lib/minecraft/components/1.21.8";
import { BooleanComponent, ComponentText, NumberComponent } from "$lib/minecraft/components/common";

export abstract class Component<T> {
    public abstract serialize(): string;
    public abstract deserialize(value?: string): Component<T>;
    public abstract get(): T | undefined;
}

export class ComponentType<T> {
    private id: string;
    private component: Component<T>;

    public constructor(id: string, component: Component<T>) {
        this.id = id;
        this.component = component;
    }

    public create(value?: string) {
        this.component = this.component.deserialize(value);
        return this.component;
    }

    public createDefault() {
        return this.component;
    }

    public getId() {
        return this.id;
    }

    public static of<T>(id: string, component: Component<T>) {
        return new ComponentType(id, component);
    }
}

export class DataComponentTypes {
    public static KEYS: Record<string, ComponentType<any>> = {};

    public static readonly MAX_STACK_SIZE = DataComponentTypes.register(ComponentType.of("minecraft:max_stack_size", new NumberComponent()));
    public static readonly RARITY = DataComponentTypes.register(ComponentType.of("minecraft:rarity", new Rarity()));
    public static readonly TOOLTIP_DISPLAY = DataComponentTypes.register(ComponentType.of("minecraft:tooltip_display", new TooltipDisplay()));
    public static readonly CUSTOM_NAME = DataComponentTypes.register(ComponentType.of("minecraft:custom_name", new ComponentText()));
    public static readonly ITEM_NAME = DataComponentTypes.register(ComponentType.of("minecraft:item_name", new ComponentText()));
    public static readonly DAMAGE_RESISTANT = DataComponentTypes.register(ComponentType.of("minecraft:damage_resistant", new DamageResistant()));
    public static readonly FOOD = DataComponentTypes.register(ComponentType.of("minecraft:food", new Food()));
    public static readonly ENCHANTMENT_GLINT_OVERRIDE = DataComponentTypes.register(
        ComponentType.of("minecraft:enchantment_glint_override", new BooleanComponent())
    );

    public static register<T>(type: ComponentType<T>) {
        if (!this.KEYS) this.KEYS = {};
        this.KEYS[type.getId()] = type;
        return type;
    }

    public static getFromId(id: string) {
        return this.KEYS[id];
    }
}

export class ComponentMap {
    public map: SvelteMap<ComponentType<any>, Component<any>>;

    public constructor() {
        this.map = $state(new SvelteMap());
    }

    public put<T extends Component<T>>(key: ComponentType<T>, value: T | null) {
        value != null ? this.map.set(key, value) : this.map.delete(key);
    }

    public getOrPut<T extends Component<T>>(key: ComponentType<T>): T {
        if (!this.has(key)) this.put(key, key.createDefault());
        return this.get(key)!.get()!;
    }

    public add<T extends Component<T>>(key: ComponentType<T>, value: Component<T> | null): ComponentMap {
        this.put(key, value);
        return this;
    }

    public get<T>(type: ComponentType<T>): T | null {
        return this.map.get(type)?.get() || null;
    }

    public getOrDefault<T extends Component<T>>(type: ComponentType<T>): T {
        return this.map.get(type)?.get() || type.createDefault().get();
    }

    public has<T>(type: ComponentType<T>): boolean {
        return this.get(type) != null;
    }

    public remove<T>(type: ComponentType<T>) {
        this.map.delete(type);
    }

    public compute<T extends Component<T>>(type: ComponentType<T>, value: boolean, thenRun?: Consumer<T>) {
        value ? this.put(type, type.createDefault()) : this.remove(type);
        if (value && thenRun) thenRun(this.get(type)!.get()!);
        this.map = this.map;
    }

    public getKeys() {
        return this.map.keys();
    }

    public entries() {
        return this.map.entries();
    }

    public serialize() {
        const result: Record<string, any> = {};
        for (const type of this.map.keys()) {
            const id = type.getId();
            if (this.has(type)) {
                result[id] = this.get(type)!.serialize();
            }
        }
        return JSON.stringify(result);
    }

    public deserialize(value: string) {
        const parsed: Record<string, any> = JSON.parse(value);

        for (const [k, v] of Object.entries(parsed)) {
            const type = DataComponentTypes.getFromId(k);
            const deserialized = type.create(v);
            this.put(type, deserialized);
        }
    }
}
