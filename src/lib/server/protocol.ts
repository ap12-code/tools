import net from 'net';
import { Buffer } from 'node:buffer';
import varint from 'varint';

export function getStatus(host: string, port: number): Promise<any> {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let responseDataBuffer = Buffer.alloc(0);
        client.setTimeout(3000);
        client.on('timeout', () => {
            reject('Connection Timed out.');
            client.end();
        });
        client.on('error', (err) => {
            reject(err);
        });
        client.on('data', (d) => {
            responseDataBuffer = Buffer.concat([responseDataBuffer, d]);
            let responseDataBufferLength: number;
            try {
                responseDataBufferLength = varint.decode(responseDataBuffer);
            } catch (error) {
                return;
            }
            if (responseDataBuffer.length < responseDataBufferLength - varint.decode.bytes!) return;
            let offset = varint.decode.bytes!;

            varint.decode(responseDataBuffer, offset);
            offset += varint.decode.bytes!;

            // JSON Length
            varint.decode(responseDataBuffer, offset);
            offset += varint.decode.bytes!;

            try {
                const response = JSON.parse(responseDataBuffer.toString('utf-8', offset));

                resolve(response);
            } catch (error) {
                reject(error);
            }

            client.end();
        });
        client.on('ready', () => {
            const packetBuffer = Buffer.from([0x00]);
            const protocolBuffer = Buffer.from(varint.encode(765));
            const hostLengthBuffer = Buffer.from(varint.encode(host.length));
            const hostBuffer = Buffer.from(host);
            const portBuffer = Buffer.alloc(2);
            portBuffer.writeUInt16BE(port);
            const stateBuffer = Buffer.from([0x01]);

            const dataBuffer = Buffer.concat([packetBuffer, protocolBuffer, hostLengthBuffer, hostBuffer, portBuffer, stateBuffer]);
            const dataLengthBuffer = Buffer.from(varint.encode(dataBuffer.length));

            const handshakeBuffer = Buffer.concat([dataLengthBuffer, dataBuffer]);
            client.write(handshakeBuffer);

            const requestBuffer = Buffer.from([0x01, 0x00]);
            client.write(requestBuffer);
        });
        client.connect({ host: host, port: port, noDelay: true });
    });
}
