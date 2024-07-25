import { Analyser, AnalyserType } from ".";
import { PackageInfo, PackageInfoList } from "../package_info";
import { Package } from "../package";
import * as utils from "../utils";

type Pair<K, V> = utils.Pair<K, V>;

export class NpmAnalyser implements Analyser {
    packageInfoList: PackageInfoList | undefined;
    rootPackageInfo: PackageInfo | undefined;

    getType(): AnalyserType {
        return AnalyserType.NpmAnalyser;
    }

    analyze(packageInfoList: PackageInfoList): Promise<Package> {
        this.rootPackageInfo = packageInfoList.pop()
        this.packageInfoList = packageInfoList;

        return new Promise((resolve, reject) => {
            if (this.rootPackageInfo === undefined) {
                reject("rootPackageInfo is undefined");
                return;
            }

            let lambda = (info: PackageInfo): Package => {
                let p = new Package(info.name, info.version, info.desc, info.license);

                if (info.deps.length === 0 && info.devDeps.length === 0) {
                    return p;
                }

                if (info.isRoot) {
                    for (let i = 0; i < info.devDeps.length; i++) {
                        if (this.packageInfoList !== undefined) {
                            for (let j = 0; j < this.packageInfoList.length; j++) {
                                if (info.devDeps[i].k.localeCompare(this.packageInfoList.items[j].name) === 0) {
                                    let np = lambda(this.packageInfoList.items[j])
                                    p.devDeps.push(np);
                                    break;
                                }
                            }
                        }
                    }
                }

                for (let i = 0; i < info.deps.length; i++) {
                    if (this.packageInfoList !== undefined) {
                        for (let j = 0; j < this.packageInfoList.length; j++) {
                            if (info.deps[i].k.localeCompare(this.packageInfoList.items[j].name) === 0) {
                                let np = lambda(this.packageInfoList.items[j])
                                p.deps.push(np);
                                break;
                            }
                        }
                    }
                }

                return p;
            }

            let root = lambda(this.rootPackageInfo);
            root.isRoot = true;

            resolve(root);
        });
    }

    private analyzeRecursively(packageInfo: PackageInfo): Promise<Package> {
        return new Promise((resolve, reject) => {
        });
    }
}
