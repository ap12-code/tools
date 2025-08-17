export class ActionResult<T> {
    private _value: T | null;
    private _error: Error | null;

    private constructor(value: T | null, error: Error | null) {
        this._value = value;
        this._error = error;
    }

    get value(): T | null {
        return this._value;
    }

    get error(): Error | null {
        return this._error;
    }

    public static success<T>(val: T): ActionResult<T> {
        return new ActionResult(val, null);
    }

    public static fail<T>(msg: string) {
        return new ActionResult<T>(null, new Error(msg));
    }

    public static error<T>(error: Error | null) {
        return new ActionResult<T>(null, error);
    }

    public is_error(): this is { error: Error; value: null } {
        return this.get_error() instanceof Error;
    }

    public is_success(): this is { error: null; value: T } {
        return !this.is_error();
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
        } else if (this.is_success()) {
            return this.value!;
        }
        throw TypeError("Illegal state");
    }

    public get_error(): Error {
        return this.error!;
    }

    public map<R>(mapper: (val: T) => R): ActionResult<R> {
        if (this.is_success()) {
            try {
                return ActionResult.success(mapper(this.value));
            } catch (e) {
                if (e instanceof Error) {
                    return ActionResult.error(e);
                } else {
                    return ActionResult.fail("Error");
                }
            }
        } else {
            return ActionResult.error(this.error);
        }
    }
}
