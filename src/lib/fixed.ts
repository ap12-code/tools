import type { Comparable } from './base';

export abstract class JNumber extends Number {
    abstract intValue(): Integer;
    abstract longValue(): Long;
    abstract floatValue(): Float;
    abstract doubleValue(): Double;

    byteValue(): Byte {
        return new Byte(this.intValue());
    }
    shortValue(): Short {
        return new Short(this.intValue());
    }
}

export function int(value: number) {
    return new Integer(value);
}

export class Byte extends Number {
    private internalValue: number | Number;
    constructor(i: number | Number) {
        super();
        this.internalValue = i;
    }
}
export class Short extends Number {
    private internalValue: number | Number;
    constructor(i: number | Number) {
        super();
        this.internalValue = i;
    }
}

export class Integer extends Number implements Comparable<Integer> {
    private internalValue: number;

    constructor(i: number) {
        super();
        this.internalValue = i;
    }
    compareTo(other: Integer): Integer {
        throw new Error('Method not implemented.');
    }

    valueOf(): number {
        return this.internalValue;
    }
}
export class Long {}

export class Float {}
export class Double {}
