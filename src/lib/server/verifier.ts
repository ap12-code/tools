export const IP_REGEX = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
export const ADDRESS_REGEX = new RegExp(/(?=^.{4,253}\.?$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}\.?$)/);

function verifyIP(addr: string): boolean {
    if (!addr) return false;
    if (!IP_REGEX.test(addr)) return false;

    return true;
}

export function verifyAddress(addr: string): boolean {
    if (!addr) return false;
    if (!ADDRESS_REGEX.test(addr)) return false;

    return true;
}
