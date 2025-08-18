import { json, type RequestHandler } from '@sveltejs/kit';
import versions from '$lib/versions.json';

export const GET: RequestHandler = async () => {
    return json(versions);
};
