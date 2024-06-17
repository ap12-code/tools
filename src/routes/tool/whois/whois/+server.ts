import { error, type RequestHandler } from "@sveltejs/kit";
import { promisify } from "util"
import { exec } from "child_process"
import { verifyAddress } from "$lib/server/verifier";

const execAsync = promisify(exec)

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    if (!body || !body.address) throw error(400)
    if (body.address.includes(" ")) throw error(403)
    if (!verifyAddress(body.address)) throw error(403)
    try {
        const { stdout } = await execAsync(`whois ${body.address}`)
        return new Response(stdout.toString())
    } catch (e: any) {
        return new Response(e.stderr)
    }
}