import { Byte, Integer } from '$lib/fixed';
import type { Optional } from '../utils';
import type { NBTElement, NBTType } from './element';
import type { NBTScanner } from './scanner';
import type { NBTElementVisitor } from './visitor';

export class NBTEnd implements NBTElement {
    write(): void {}
    toString(): string {
        return '';
    }
    getType(): Byte {
        return new Byte(8);
    }
    getNBTType(): NBTType<any> {
        throw new Error('Method not implemented.');
    }
    copy(): NBTElement {
        throw new Error('Method not implemented.');
    }
    getSizeInBytes(): Integer {
        return new Integer(8);
    }
    accept(visitor: NBTElementVisitor): void {
        throw new Error('Method not implemented.');
    }
    doAccept(visitor: NBTScanner): NBTScanner.Result {
        throw new Error('Method not implemented.');
    }
    accept2(visitor: NBTScanner): void {}
    asString(): Optional<string> {
        throw new Error('Method not implemented.');
    }
    asNumber(): Optional<Number> {
        throw new Error('Method not implemented.');
    }
    asByte(): Optional<Byte> {
        throw new Error('Method not implemented.');
    }
}
