import { error, type RequestHandler } from "@sveltejs/kit";
import { promisify } from "util"
import { exec } from "child_process"
import { verifyAddress } from "$lib/server/verifier";
import mcping from "mcping-js"

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    if (!body || !body.address) throw error(400)
    if (!verifyAddress(body.address)) throw error(403)
    const url = new URL(`http://${body.address}`)
    const promise = await new Promise<mcping.PingResponse>((resolve, reject) => {
        const server = new mcping.MinecraftServer(url.hostname, parseInt(url.port) || 25565)
        server.ping(3000, undefined, (err, res) => {
            if (!res || err) return reject(err)
            resolve(res)
        })
    })
    return new Response(JSON.stringify(promise))
}