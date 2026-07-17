import type { Integer } from './fixed';

export interface Comparable<T> {
    compareTo(other: T): Integer;
}
