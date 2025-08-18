import type { PageServerLoad } from './$types';
import itemsData from '$lib/minecraft/data/1.21.8/item.json';
import damageTypeData from '$lib/minecraft/data/1.21.8/damage_type.json';

export const load: PageServerLoad = async () => {
    return {
        items: itemsData.entries,
        damage_tags: damageTypeData.tags
    };
};
