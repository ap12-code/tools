import { Integer, type Byte } from '$lib/fixed';
import { Optional } from '../utils';
import type { DataInput } from './input';
import { NBTScanner } from './scanner';
import type { NBTSizeTracker } from './tracker';

export abstract class NBTType<T extends NBTElement> {
    abstract read(input: DataInput, tracker: NBTSizeTracker): T;
    abstract doAccept(input: DataInput, visitor: NBTScanner, tracker: NBTSizeTracker): NBTScanner.Result;
    accept(input: DataInput, visitor: NBTScanner, tracker: NBTSizeTracker): void {
        switch (visitor.start(this)) {
            case NBTScanner.Result.CONTINUE:
                this.doAccept(input, visitor, tracker);
                break;
            case NBTScanner.Result.BREAK:
                this.skip(input, null, tracker);
            case NBTScanner.Result.HALT:
        }
    }
    abstract skip(input: DataInput, count: Integer | null, tracker: NBTSizeTracker): void;
    createInvalid(): NBTType<NBTEnd>;
}

export abstract class NBTElement {
    abstract write(): void;
    abstract toString(): string;
    abstract getType(): Byte;
    abstract getNBTType(): NBTType<any>;
    abstract copy(): NBTElement;
    abstract getSizeInBytes(): Integer;
    abstract accept(visitor: NBTElementVisitor): void;
    abstract doAccept(visitor: NBTScanner): NBTScanner.Result;
    accept2(visitor: NBTScanner) {
        const result = visitor.start(this.getNBTType());
        if (result == NBTScanner.Result.CONTINUE) {
            this.doAccept(visitor);
        }
    }

    asString(): Optional<string> {
        return Optional.empty();
    }
    asNumber(): Optional<Number> {
        return Optional.empty();
    }
    asByte(): Optional<Byte> {
        return this.asNumber();
    }
}

export class NBTPrimitive {}
