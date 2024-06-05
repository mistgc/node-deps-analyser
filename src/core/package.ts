class Package {
    name: string;
    version: string;
    description: string = "Unknown";
    license: string = "Unknown";
    dependencies: Package[] | null = null;
    dev_dependencies: Package[] | null = null;

    constructor(name: string, version: string) {
        this.name = name;
        this.version = version;
    }

    //TODO
    //jsonlize(): string {
    //}
}
