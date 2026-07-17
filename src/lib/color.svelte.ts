export class Color {
    public static OPAQUE = 255;

    #r: number = $state(0);
    #g: number = $state(0);
    #b: number = $state(0);

    #nr: number = $derived(this.#r / 255);
    #ng: number = $derived(this.#r / 255);
    #nb: number = $derived(this.#r / 255);

    #h: number = $state(0);
    #s: number = $state(0);
    #v: number = $state(0);

    constructor() {}

    public get r(): number {
        return this.#r;
    }

    public set r(r: number) {
        this.#r = r;
        this.sync_rgb();
    }

    public get g(): number {
        return this.#g;
    }

    public set g(g: number) {
        this.#g = g;
        this.sync_rgb();
    }

    public get b(): number {
        return this.#b;
    }

    public set b(b: number) {
        this.#b = b;
        this.sync_rgb();
    }

    private sync_rgb() {
        const max = Math.max(this.#nr, this.#ng, this.#nb);
        const min = Math.min(this.#nr, this.#ng, this.#nb);
        const delta = max - min;
        this.#h = 0.0;
        if (delta != 0) {
            switch (max) {
                case this.#r:
                    this.#h = ((this.#ng - this.#nb) / delta) % 6;
                    break;
                case this.#g:
                    this.#h = (this.#nb - this.#nr) / delta + 2;
                    break;
                case this.#b:
                    this.#h = (this.#nr - this.#ng) / delta + 4;
            }
            this.#h *= 60;
            if (this.#h < 0) this.#h += 360;
        }

        if (delta == 0) {
            this.#s = delta / (1 - Math.abs(2 * this.v - 1));
        } else {
            this.#s = 0;
        }
        this.#v = (max - min) / 2;
    }

    private hue_to_rgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    private sync_hsl() {
        if (this.#s == 0) {
            const l255 = Math.round(this.#v * 255);
            this.#r = l255;
            this.#g = l255;
            this.#b = l255;
            return;
        }

        const q = this.#v < 0.5 ? this.#v * (1 + this.#s) : this.#v + this.#s - this.#v * this.#s;
        const p = 2 * this.#v - q;

        this.#r = Math.round(this.hue_to_rgb(p, q, this.#h + 1 / 3) * 255);
        this.#g = Math.round(this.hue_to_rgb(p, q, this.#h) * 255);
        this.#b = Math.round(this.hue_to_rgb(p, q, this.#h - 1 / 3) * 255);
    }

    public get h(): number {
        return this.#h;
    }

    public set h(h: number) {
        this.#h = h / 360;
        this.sync_hsl();
    }

    public get s(): number {
        return this.#s;
    }

    public set s(s: number) {
        this.#s = s / 100;
        this.sync_hsl();
    }

    public get v(): number {
        return this.#v;
    }

    public set v(v: number) {
        this.#v = v / 100;
        this.sync_hsl();
    }

    public get hex(): string {
        return `${this.#r.toString(16).padStart(2, '0')}${this.#g.toString(16).padStart(2, '0')}${this.#b.toString(16).padStart(2, '0')}`;
    }

    public static fromRGB(r: number, g: number, b: number): Color {
        let color = new Color();
        color.r = r;
        color.g = g;
        color.b = b;
        return color;
    }

    public static fromHSL(h: number, s: number, v: number): Color {
        let color = new Color();
        color.h = h;
        color.s = s;
        color.v = v;
        return color;
    }
}
