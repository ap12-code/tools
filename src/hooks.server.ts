import moment from "moment"

export const handle = async ({ event, resolve }) => {
    console.log(`${moment().format("YYYY/MM/DD HH:mm:ss")} - ${event.request.method} ${event.url.pathname}`)

    return await resolve(event)
}