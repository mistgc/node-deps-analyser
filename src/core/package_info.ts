import * as utils from "./utils";

type Pair<K, V> = utils.Pair<K, V>;

export class PackageInfo {
    name: string;
    version: string;
    path: string;
    dependencies: Pair<string, string>[];
    devDependencies: Pair<string, string>[];

    constructor(name: string, version: string, path: string, dependencies: Pair<string, string>[], devDependencies: Pair<string, string>[]) {
        this.name = name;
        this.version = version;
        this.path = path;
        this.dependencies = dependencies;
        this.devDependencies = devDependencies;
    }
}

export class PackageInfoList {
    items: PackageInfo[];

    constructor() {
        this.items = [];
    }

    push(packageInfo: PackageInfo) {
        this.items.push(packageInfo);
    }

    remove(index: number) {
        this.items = this.items.filter((_val, i) => {
            return i !== index;
        });
    }

    contained(packageInfo: PackageInfo): boolean {
        return this.findIndex(packageInfo) >= 0;
    }

    findIndex(packageInfo: PackageInfo): number {
        return this.items.findIndex((value, _index) => {
            return value.name === packageInfo.name && value.version === packageInfo.version;
        });
    }
}
