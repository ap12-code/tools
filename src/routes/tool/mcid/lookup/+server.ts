import { error, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    if (!body || !body.mcid) error(400);
    const resp = await fetch(`https://api.mojang.com/users/profiles/minecraft/${body.mcid}`)
    if (!resp.ok) error(502);
    let result = await resp.json()
    if (!result) error(500);
    result.uuid = `${result.id.slice(0, 8)}-${result.id.slice(8, 12)}-${result.id.slice(12, 16)}-${result.id.slice(16, 20)}-${result.id.slice(20, 32)}`;
    return new Response(JSON.stringify(result), {headers: {"Vary": "Origin", "Access-Control-Allow-Origin": "*"}})
}