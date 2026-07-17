import type { SpyglassVersion } from '../../routes/tool/pack-mcmeta/versions.svelte';

export class VersionFilterOptions {
    public type_snapshot: boolean = $state(true);
    public type_release: boolean = $state(true);
    public keyword: string = $state('');

    constructor() {}

    public apply(versions: SpyglassVersion[]): SpyglassVersion[] {
        const filtered = versions
            .filter((ver) => (ver.type == 'snapshot' ? this.type_snapshot : true))
            .filter((ver) => (ver.type == 'release' ? this.type_release : true))
            .filter((ver) => ver.id && ver.id.includes(this.keyword));

        const exact = filtered.findIndex((v) => v.id == this.keyword);
        if (exact >= 1) {
            filtered.splice(0, 0, filtered.splice(exact, 1)[0]);
        }
        return filtered;
    }

    public reset() {
        this.type_release = true;
        this.type_snapshot = true;
        this.keyword = '';
    }
}
