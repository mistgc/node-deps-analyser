import { PackageInfo, PackageInfoList } from "./package_info";
import fs from "fs";
import path from "path";
import * as utils from "./utils";
import { AnalyserFactory, AnalyserType } from "./analyser";
import { Package } from "./package";

type Pair<K, V> = utils.Pair<K, V>;

function generatePackageInfoList(targetPath: string): Promise<PackageInfoList> {
    return new Promise((resolve, reject) => {
        if (!utils.verifyIfDirContainItems(targetPath, ["package.json", "node_modules"])) {
            reject(`The target project ${targetPath} doesn't have "package.json" file or "node_modules" folder.`);
            return;
        }

        let list = new PackageInfoList();

        let items = fs.readdirSync(path.join(targetPath, "node_modules"));
        items.forEach((item) => {
            let itemPath = path.join(targetPath, "node_modules", item);
            if (item[0] === "@") {
                let subItems = fs.readdirSync(itemPath);
                subItems.forEach((subItem) => {
                    let jsonText = fs.readFileSync(path.join(itemPath, subItem, "package.json")).toString();
                    list.push(PackageInfo.fromJsonText(jsonText))
                });
            } else if (item[0] === ".") {
                // TODO:
            } else {
                let jsonText = fs.readFileSync(path.join(itemPath, "package.json")).toString();
                list.push(PackageInfo.fromJsonText(jsonText))
            }
        })
        resolve(list);
    });
}

/**
 * Analyze a package specified by the `targetPath` and return
 * the generated package wrapped by the Promise.
 * @param targetPath The path of the specific project
 * @returns Serialized as a JSON format string that indicate a
 *          step-by-step dependency graph for a given target item.
 */
export async function analyze(targetPath: string, depth: number = -1): Promise<Package> {
    let rootPackageInfo = PackageInfo.fromJsonText(fs.readFileSync(path.join(targetPath, "package.json")).toString());
    rootPackageInfo.isRoot = true;
    return new Promise((resolve, reject) => {
        generatePackageInfoList(targetPath)
            .then((packageInfoList) => {
                // Puts the root package in the last of the `packageInfoList`.
                packageInfoList.push(rootPackageInfo);
                let analyser = AnalyserFactory.createAnalyser(AnalyserType.NpmAnalyser);
                analyser.analyze(packageInfoList, depth).then((res) => {
                    resolve(res);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}
