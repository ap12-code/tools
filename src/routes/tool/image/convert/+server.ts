import { error, type RequestHandler } from "@sveltejs/kit";
import sharp from "sharp"

export const POST: RequestHandler = async ({ request, url }) => {
    const to_ext = url.searchParams.get("to")
    if (!to_ext) error(400);
    const ext_enum = to_ext as keyof sharp.FormatEnum
    const stream = await request.formData()
    const file = stream.get("uploadfile")
    if (!file || !(file instanceof File)) error(400);
    const ctx = sharp(await file.arrayBuffer())

    return new Response(await ctx.toFormat(ext_enum).toBuffer(), {headers: {"Access-Control-Allow-Origin": "*"}});
};