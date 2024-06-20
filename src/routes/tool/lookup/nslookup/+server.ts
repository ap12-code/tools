import { error, type RequestHandler } from "@sveltejs/kit";
import { promisify } from "util"
import { exec } from "child_process"
import { verifyAddress } from "$lib/server/verifier";

const execAsync = promisify(exec)

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    if (!body || !body.address) throw error(400)
    if (!verifyAddress(body.address)) throw error(403)
    if (body.address.includes(" ")) throw error(403)
    try {
        const { stdout } = await execAsync(`nslookup ${body.address} 1.1.1.1`)
        return new Response(stdout, {headers: {"Access-Control-Allow-Origin": "*"}})
    } catch (e: any) {
        return new Response(e.stdout)
    }

}