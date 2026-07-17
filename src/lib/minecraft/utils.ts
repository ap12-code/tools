export class Optional<T> {
    private value: T;
    private constructor(value: T) {
        this.value = value;
    }

    public static empty<T>(): Optional<T> {
        return new Optional(null as any);
    }
}
