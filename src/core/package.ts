export class Package {
    public isRoot: boolean = false;
    public name: string;
    public version: string;
    public description: string;
    public license: string;
    public deps: Package[] = [];
    public devDeps: Package[] = [];

    constructor(name: string, version: string, description: string = "", license: string = "Unknown") {
        this.name = name;
        this.version = version;
        this.description = description;
        this.license = license;
    }

    fmt(tab: string = ""): string {
        tab += "\t";

        let depsText = "\n";
        this.deps.forEach((dep) => {
            depsText += dep.fmt(tab) + "\n";
        });

        if (this.isRoot) {
            let devDepsText = "\n";
            this.devDeps.forEach((devDep) => {
                devDepsText += devDep.fmt(tab) + "\n";
            });
            return `
name: ${this.name},
version: ${this.version},
description: ${this.description},
license: ${this.license},
deps: {${depsText}}
devDeps: {${devDepsText}}
`;
        } else {
            return `
name: ${this.name},
version: ${this.version},
description: ${this.description},
license: ${this.license},
deps: {${depsText}}
`;
        }
    }

    //TODO
    //jsonlize(): string {
    //}
}
