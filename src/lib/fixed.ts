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

export class Byte {}
export class Short {}
export class Integer extends Number implements Comparable<Integer> {
    private internalValue: number;

    constructor(i: number) {
        super();
        this.internalValue = i;
    }

    public static toString(i: Integer, radix: Integer) {
        if (radix < int(2) || radix > int(36)) {
            radix = int(10);
        }
        if (radix == int(10)) {
            return this.toString2(i);
        } else {
            const buf = new ByteArray();
        }
    }
    valueOf(): number {
        return this.internalValue;
    }
}
export class Long {}

export class Float {}
export class Double {}
