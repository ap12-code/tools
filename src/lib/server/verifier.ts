// place files you want to import through the `$lib` alias in this folder.

const addr_regex = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/

function verifyIP(addr: string): boolean {
    if (addr_regex.test(addr)) {
        return true
    }
    return false
}

export function verifyAddress(addr: string): boolean {
    if (!addr) return false
    if (addr.match(/[&!"#\$%'\(\)=\*\+\,\>\<;:]/)) return false
    try {
        new URL(`http://${addr}`)
        return true
    } catch (e) {
        return false
    }
}