import type { Item, ItemStack, Nullable, TextData, TrueOrNull } from "./types";

type FoodComponentEffect = {
    effect: {
        id: string;
        amplifier: number;
        duration: number;
        ambient: boolean;
        show_particles: boolean;
        show_icon: boolean;
    };
    probability: number;
};

export type FoodComponent = {
    nutrition: number;
    saturation: number;
    can_always_eat: Nullable<boolean>;
    eat_seconds: Nullable<number>;
    using_converts_to: Nullable<ItemStack>;
    effects: Nullable<Partial<FoodComponentEffect[]>>;
};

type _ComponentMap = {
    custom_model_data: Nullable<number>;
    damage: Nullable<number>;
    max_stack_size: Nullable<number>;
    rarity: Nullable<string>;
    item_name: Nullable<TextData>;
    hide_tooltip: boolean;
    hide_additional_tooltip: boolean;
    custom_name: TextData;
    food: Partial<FoodComponent>;
    fire_resistant: boolean;
};

export type ComponentMap = Partial<_ComponentMap>;
