import type { PageServerLoad } from "./$types";
import versions from "$lib/versions.json"

export const load: PageServerLoad = async () => {
    const data: Record<string, Record<string, number>> = versions
    return {
        versions: data
    }
};