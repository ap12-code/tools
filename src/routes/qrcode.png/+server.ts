import { error, type RequestHandler } from '@sveltejs/kit';
import qrcode from 'qrcode';

export const GET: RequestHandler = async ({ url }) => {
    const param = url.searchParams.get('data');
    if (!param) error(400);

    const data = await qrcode.toBuffer(param);
    return new Response(data);
};
