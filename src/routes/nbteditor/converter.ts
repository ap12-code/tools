import {
    getTagType,
    Int16,
    Int32,
    Int8,
    TAG,
    type ByteArrayTag,
    type ByteTag,
    type CompoundTag,
    type DoubleTag,
    type FloatTag,
    type IntArrayTag,
    type IntTag,
    type ListTag,
    type LongArrayTag,
    type LongTag,
    type ShortTag,
    type StringTag,
    type Tag
} from 'nbtify';

export type ArrayTag = ByteArrayTag | IntArrayTag | LongArrayTag | ListTag<any>;
export type PrimitiveIntTag = ByteTag | ShortTag | IntTag | LongTag;
export type NumberTag = PrimitiveIntTag | FloatTag | DoubleTag;

export type TagTypeMap = {
    [TAG.BYTE]: ByteTag;
    [TAG.BYTE_ARRAY]: ByteArrayTag;
    [TAG.COMPOUND]: CompoundTag;
    [TAG.DOUBLE]: DoubleTag;
    [TAG.FLOAT]: FloatTag;
    [TAG.INT]: IntTag;
    [TAG.INT_ARRAY]: IntArrayTag;
    [TAG.LIST]: ListTag<Tag>;
    [TAG.LONG]: LongTag;
    [TAG.LONG_ARRAY]: LongArrayTag;
    [TAG.SHORT]: ShortTag;
    [TAG.STRING]: StringTag;
    [TAG.END]: null;
};

export type TypedTag<T extends TAG> = TagTypeMap[T];

enum IntBit {
    INT8,
    INT16,
    INT32,
    INT64
}
type IntMap = {
    [IntBit.INT8]: ByteTag;
    [IntBit.INT16]: ShortTag;
    [IntBit.INT32]: IntTag;
    [IntBit.INT64]: LongTag;
};

function createIntN(n: IntBit, input: bigint | number): IntMap[typeof n] {
    switch (n) {
        case IntBit.INT64:
            return BigInt(input);
        case IntBit.INT32:
            return new Int32(Number(input));
        case IntBit.INT16:
            return new Int16(Number(input));
        case IntBit.INT8:
            return new Int8(Number(input));
    }
}

function deserializeNumber(input: NumberTag): bigint | number {
    return input.valueOf();
}

function convertNumber(to: TAG, input: TagTypeMap[typeof to]): TypedTag<typeof to> | null {
    if (input === null) return null;

    switch (to) {
        case TAG.LONG:
            return createIntN(IntBit.INT64, Number(input));
        case TAG.INT:
            return createIntN(IntBit.INT32, Number(input));
    }

    return null;
}

export function convert<A extends TAG, B extends TAG>(input: TypedTag<A>, to: B): TypedTag<B> | null {
    switch (getTagType(input)) {
        case TAG.BYTE:

        case TAG.SHORT:
        case TAG.INT:
        case TAG.LONG:
        case TAG.FLOAT:
        case TAG.DOUBLE:
        case TAG.BYTE_ARRAY:
        case TAG.STRING:
        case TAG.LIST:
        case TAG.COMPOUND:
        case TAG.INT_ARRAY:
        case TAG.LONG_ARRAY:
    }
    return null;
}
