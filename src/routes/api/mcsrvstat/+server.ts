import { getStatus } from "$lib/server/protocol";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    const addr = url.searchParams.get("server")?.split(":");
    if (!addr) throw error(400, "Error: address not defined.");
    if (!(addr.length == 1 || addr.length == 2)) throw error(400, "Error: invalid address.");
    try {
        const status = await getStatus(addr[0], parseInt(addr[1] || "25565"));
        return json(status);
    } catch (e) {
        throw error(400, "");
    }
};
