type TooltipDisplayData = {
    hide_tooltip: boolean;
    hidden_components?: string[];
};

export class TooltipDisplay {
    private hide_tooltip: boolean = false;
    private hidden_components: string[] = [];

    public constructor() {}

    public serialize(): string {
        const data: TooltipDisplayData = {
            hide_tooltip: this.hide_tooltip
        };
        if (this.hidden_components.length > 0) {
            data.hidden_components = this.hidden_components;
        }
        return JSON.stringify(data);
    }

    public deserialize(value: string) {
        const parsed: Partial<TooltipDisplayData> = JSON.parse(value);
        if (parsed.hide_tooltip) this.hide_tooltip = parsed.hide_tooltip;
        if (parsed.hidden_components && Array.isArray(parsed.hidden_components)) this.hidden_components = parsed.hidden_components;
        return this;
    }

    public get(): TooltipDisplay | undefined {
        return this;
    }

    public getHideTooltip(): boolean {
        return this.hide_tooltip;
    }

    public setHideTooltip(value: boolean): TooltipDisplay {
        this.hide_tooltip = value;
        return this;
    }

    public getHiddenComponents(): string[] {
        return this.hidden_components;
    }

    public setHiddenComponents(value: string[]): TooltipDisplay {
        this.hidden_components = value;
        return this;
    }
}
