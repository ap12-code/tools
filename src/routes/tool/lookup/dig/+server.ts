import { error, type RequestHandler } from "@sveltejs/kit";
import { promisify } from "util"
import { exec } from "child_process"
import { verifyAddress } from "$lib/server/verifier";

const execAsync = promisify(exec)

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    if (!body || !body.address) error(400);
    if (!verifyAddress(body.address)) error(403);
    if (body.param.includes(" ")) error(403);
    try {
        const { stdout } = await execAsync(`dig @1.1.1.1 ${body.address} ${body.param}`)
        return new Response(stdout, {headers: {"Access-Control-Allow-Origin": "*"}})
    } catch (e: any) {
        console.log(e)
        return new Response(e.stderr)
    }
}