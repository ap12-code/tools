import type { PageServerLoad } from "./$types";
import minecraftData from 'minecraft-data';

export const load: PageServerLoad = async () => {
    const data = minecraftData("1.20.4")
    return {
        items: data.items
    }
};