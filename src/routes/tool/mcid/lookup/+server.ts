import { error, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const BodySchema = z.object({
    mcid: z
        .string()
        .regex(/^[a-zA-Z0-9_]{1,16}$/)
        .or(z.uuidv4())
});

type BodySchema = z.infer<typeof BodySchema>;

export const POST: RequestHandler = async ({ request }) => {
    const body = BodySchema.safeParse(await request.json());
    if (!body.success) error(400);
    if (body.data.mcid.match(/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/)) {
        const resp = await fetch(`https://api.minecraftservices.com/minecraft/profile/lookup/${body.data.mcid}`);
        if (!resp.ok) error(resp.status);
        let result = await resp.json();
        if (!result) error(500);
        result.uuid = `${result.id.slice(0, 8)}-${result.id.slice(8, 12)}-${result.id.slice(12, 16)}-${result.id.slice(16, 20)}-${result.id.slice(20, 32)}`;
        return new Response(JSON.stringify(result), { headers: { Vary: 'Origin', 'Access-Control-Allow-Origin': '*' } });
    } else {
        const resp = await fetch(`https://api.mojang.com/users/profiles/minecraft/${body.data.mcid}`);
        if (!resp.ok) error(resp.status);
        let result = await resp.json();
        if (!result) error(500);
        result.uuid = `${result.id.slice(0, 8)}-${result.id.slice(8, 12)}-${result.id.slice(12, 16)}-${result.id.slice(16, 20)}-${result.id.slice(20, 32)}`;
        return new Response(JSON.stringify(result), { headers: { Vary: 'Origin', 'Access-Control-Allow-Origin': '*' } });
    }
};
