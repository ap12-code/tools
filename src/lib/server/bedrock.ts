import { Client } from 'bedrock-protocol';

export function ping(host: string, port: number): Promise<any> {
    return new Promise((resolve, reject) => {
        const raknet = new Client({
            host,
            port
        });
    });
}
