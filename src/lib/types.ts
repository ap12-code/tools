export class ActionResult<T> {
    private value: T | null;
    private error: Error | null;

    constructor(value: T | null, error: Error | null) {
        this.value = value;
        this.error = error;
    }

    public static success<T>(val: T) {
        return new ActionResult(val, null);
    }

    public static fail<T>(msg: string) {
        return new ActionResult<T>(null, new Error(msg));
    }

    public is_error(): boolean {
        return this.error != null;
    }

    public get_nullable(): T | null {
        return this.value;
    }

    public get(): T {
        return this.value!;
    }

    public get_or_throw(): T {
        if (this.is_error()) {
            throw this.error;
        } else {
            return this.value!;
        }
    }

    public get_error(): Error {
        return this.error!;
    }
}
