import type { PageServerLoad } from "./$types";
import itemsData from "$lib/data/1.21/items.json";

export const load: PageServerLoad = async () => {
    return {
        items: itemsData,
    };
};
