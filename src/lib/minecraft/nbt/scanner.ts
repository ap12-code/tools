import type { NBTType } from './element';

export interface NBTScanner {
    start(rootType: NBTType<any>): NBTScanner.Result;
}

export namespace NBTScanner {
    export enum Result {
        CONTINUE,
        BREAK,
        HALT
    }

    export enum NestedResult {
        ENTER,
        SKIP,
        BREAK,
        HALT
    }
}
