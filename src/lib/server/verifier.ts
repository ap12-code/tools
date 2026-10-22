import net from 'node:net';

export const ADDRESS_REGEX = new RegExp(/(?=^.{4,253}\.?$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}\.?$)/);

export function verifyAddress(addr: string): boolean {
    if (!addr) return false;

    return ADDRESS_REGEX.test(addr) || net.isIPv4(addr) || net.isIPv6(addr);
}
