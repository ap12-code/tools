import type { TextData } from '$lib/minecraft/types';
import { DateTime } from 'luxon';

export type VersionType = 'dp' | 'rp';
export type PackMcmetaV0 = {
    pack: {
        pack_format: Version;
        description: TextData;
    };
};
export type PackMcmetaV1 = {
    pack: {
        pack_format?: Version;
        description: TextData;
        supported_formats?: {
            min_inclusive: Version;
            max_inclusive: Version;
        };
    };
};
export type PackMcmetaV2 = {
    pack: {
        min_format: Version;
        max_format: Version;
        description: TextData;
    };
};
export type PackMcmeta = PackMcmetaV0 | PackMcmetaV1 | PackMcmetaV2;

const versionV2 = {
    dp: 82,
    rp: 65
};

export class Version {
    constructor(
        public major: number,
        public minor: number
    ) {}

    public getSupportVersion(vType: VersionType): 0 | 1 | 2 {
        return this.isV2(vType) ? 2 : this.isV0(vType) ? 0 : 1;
    }
    public isV2(vType: VersionType): boolean {
        return this.major > versionV2[vType];
    }
    public isV0(vType: VersionType): boolean {
        return this.major < 16;
    }
    public supportRanged(vType: VersionType): boolean {
        return !this.isV0(vType);
    }
    public toJSON(): any {
        return this.minor == 0 ? this.major : [this.major, this.minor];
    }
}

export interface SpyglassVersionData {
    id: string;
    name: string;
    release_target: any | null;
    type: 'snapshot' | 'release' | 'old-alpha' | string;
    stable: boolean;
    data_version: number;
    protocol_version: number;
    data_pack_version: number;
    data_pack_version_minor: number;
    resource_pack_version: number;
    resource_pack_version_minor: number;
    build_time: string;
    release_time: string;
    sha1: string;
}

export class SpyglassVersion {
    public id!: string;
    public name!: string;
    public release_target!: any | null;
    public type!: 'snapshot' | 'release' | 'old-alpha' | string;
    public stable!: boolean;
    public data_version!: number;
    public protocol_version!: number;
    public data_pack_version!: number;
    public data_pack_version_minor!: number;
    public resource_pack_version!: number;
    public resource_pack_version_minor!: number;
    public build_time!: string;
    public release_time!: string;
    public sha1!: string;

    constructor(data: SpyglassVersionData) {
        Object.assign(this, data);
    }

    public getDatapackVersion(): Version | undefined {
        if (this.data_pack_version === undefined || this.data_pack_version_minor === undefined) return;
        return new Version(this.data_pack_version, this.data_pack_version_minor);
    }

    public getResourcepackVersion(): Version | undefined {
        if (this.resource_pack_version === undefined || this.resource_pack_version_minor === undefined) return;
        return new Version(this.resource_pack_version, this.resource_pack_version_minor);
    }

    public getVersion(vType: VersionType): Version | undefined {
        return vType === 'dp' ? this.getDatapackVersion() : this.getResourcepackVersion();
    }

    public isNewerThan(b: SpyglassVersion): boolean {
        return DateTime.fromISO(this.release_time).diff(DateTime.fromISO(b.release_time)).toMillis() > 0;
    }
}

export function createPackMcmeta(
    vType: VersionType,
    minimumSVersion: SpyglassVersion,
    maximumSVersion: SpyglassVersion | null,
    description: TextData
): PackMcmeta | null {
    const minimumVersion = minimumSVersion.getVersion(vType);
    if (!minimumVersion) return null;
    const maximumVersion = maximumSVersion?.getVersion(vType);

    switch (minimumVersion.getSupportVersion(vType)) {
        case 0:
            return {
                pack: {
                    description: description,
                    pack_format: new Version(minimumVersion.major, 0)
                }
            };
        case 1:
            if (maximumVersion == null) {
                return {
                    pack: {
                        description: description,
                        pack_format: minimumVersion
                    }
                };
            } else {
                return {
                    pack: {
                        description: description,
                        supported_formats: {
                            max_inclusive: maximumVersion,
                            min_inclusive: minimumVersion
                        }
                    }
                };
            }
        case 2:
            return {
                pack: {
                    description: description,
                    min_format: minimumVersion,
                    max_format: maximumVersion == null ? minimumVersion : maximumVersion
                }
            };
    }
}
