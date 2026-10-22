import { error, type RequestHandler } from '@sveltejs/kit';
import { promisify } from 'util';
import { verifyAddress } from '$lib/server/verifier';
import { execFile } from 'node:child_process';
import z from 'zod';

const execFileAsync = promisify(execFile);
const RESPONSE_HEADERS = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
};

const RequestSchema = z
    .object({
        address: z.string(),
        param: z.enum(['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SOA', 'TXT'] as const)
    })
    .superRefine((data, ctx) => {
        if (!verifyAddress(data.address)) {
            ctx.addIssue({
                code: 'custom',
                message: 'Invalid address',
                path: ['address']
            });
        }
    });
type RequestSchema = z.infer<typeof RequestSchema>;

export const POST: RequestHandler = async ({ request }) => {
    let input: unknown;

    try {
        input = await request.json();
    } catch {
        error(400, 'Invalid Payload');
    }

    const parse_result = RequestSchema.safeParse(input);
    if (!parse_result.success) {
        error(400, 'Invalid Request');
    }
    const body = parse_result.data;

    if (!body || typeof body.address !== 'string' || typeof body.param !== 'string' || !verifyAddress(body.address)) {
        error(400, 'Invalid request');
    }

    try {
        const { stdout } = await execFileAsync('dig', ['@1.1.1.1', body.address, body.param], { timeout: 5000, maxBuffer: 1024 * 1024 });
        return new Response(stdout, { headers: RESPONSE_HEADERS });
    } catch (e: any) {
        console.log('DNS Lookup Failed');
        return new Response('DNS Lookup Failed', {
            status: 502,
            headers: RESPONSE_HEADERS
        });
    }
};
