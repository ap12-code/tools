import { error, type RequestHandler } from "@sveltejs/kit";
import { promisify } from "util"
import { exec } from "child_process"
import { verifyAddress } from "$lib/server/verifier"

const execAsync = promisify(exec)

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    if (!body || !body.address) error(400);
    if (body.address.includes(" ")) error(403);
    if (!verifyAddress(body.address)) error(403);
    try {
        const { stdout, stderr } = await execAsync(`ping -c 4 ${body.address}`)
        return new Response(stdout, {headers: {"Access-Control-Allow-Origin": "*"}})
    } catch (e: any) {
        return new Response(e.stderr)
    }
}