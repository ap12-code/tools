import { error, type RequestHandler } from "@sveltejs/kit";
import { promisify } from "util"
import { exec } from "child_process"

const execAsync = promisify(exec)

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    if (!body || !body.address) throw error(400)
    const { stdout } = await execAsync(`dig ${body.address}`)

    return new Response(stdout.toString())
}