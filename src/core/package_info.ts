import * as utils from "./utils";

type Pair<K, V> = utils.Pair<K, V>;

export class PackageInfo {
    public isRoot: boolean = false;
    public name: string;
    public version: string;
    public license: string;
    public desc: string;
    public deps: Pair<string, string>[];
    public devDeps: Pair<string, string>[];

    constructor(name: string, version: string, license: string, desc: string, deps: Pair<string, string>[], devDeps: Pair<string, string>[]) {
        this.name = name;
        this.version = version;
        this.license = license;
        this.desc = desc;
        this.deps = deps;
        this.devDeps = devDeps;
    }

    fmt(): string {
        let depsText = "\n";
        let devDepsText = "\n";

        this.deps.forEach((p) => {
            depsText += `\t${p.k}: ${p.v}\n`;
        });

        this.devDeps.forEach((p) => {
            devDepsText += `\t${p.k}: ${p.v}\n`;
        });

        return `name: ${this.name},
version: ${this.version},
license: ${this.license},
desc: ${this.desc},
deps: {${depsText}},
devDeps: {${devDepsText}},
`;
    }

    static fromJsonText(jsonText: string): PackageInfo {
        let j = JSON.parse(jsonText);
        let name = j["name"];
        let version = j["version"] === undefined ? "0.1.0" : j["version"];
        let license = j["license"] === undefined ? "Unknown" : j["license"];
        let desc = j["description"] === undefined ? "" : j["description"];
        let deps: Pair<string, string>[] = [];
        let devDeps: Pair<string, string>[] = [];

        if (j["dependencies"] !== undefined) {
            let keys: string[] = Object.keys(j["dependencies"]);
            let values: string[] = Object.values(j["dependencies"]);
            keys.forEach((k, i) => {
                deps.push(new utils.Pair(k, values[i]));
            })
        }

        if (j["devDependencies"] !== undefined) {
            let keys: string[] = Object.keys(j["devDependencies"]);
            let values: string[] = Object.values(j["devDependencies"]);
            keys.forEach((k, i) => {
                devDeps.push(new utils.Pair(k, values[i]));
            })
        }

        return new PackageInfo(name, version, license, desc, deps, devDeps);
    }
}

export class PackageInfoList {
    public items: PackageInfo[];
    public length: number;

    constructor() {
        this.items = [];
        this.length = 0;
    }

    fmt(): string {
        let fmtText = ""

        this.items.forEach((i) => {
            fmtText += i.fmt() + "\n";
        });

        return fmtText;
    }

    push(packageInfo: PackageInfo) {
        this.items.push(packageInfo);
        this.length += 1;
    }

    remove(index: number) {
        this.items = this.items.filter((_val, i) => {
            return i !== index;
        });
        this.length = this.items.length;
    }

    shift(): PackageInfo | undefined {
        this.length -= 1;
        return this.items.shift();
    }

    pop(): PackageInfo | undefined {
        this.length -= 1;
        return this.items.pop();
    }

    forEach(callbackfn: (value: PackageInfo, index: number, array: PackageInfo[]) => void, thisArg?: PackageInfoList) {
        this.items.forEach(callbackfn, thisArg);
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
