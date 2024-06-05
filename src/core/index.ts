import { PackageInfo, PackageInfoList } from "./package_info";
import fs from "fs";
import path from "path";
import * as utils from "./utils";

type Pair<K, V> = utils.Pair<K, V>;

function scanTargetProject(targetPath: string): Promise<PackageInfoList> {
    return new Promise((resolve, reject) => {
        if (!(fs.existsSync(targetPath) && fs.lstatSync(targetPath).isDirectory())) {
            reject(`${targetPath} doesn't exists or isn't a directory.`);
            return;
        }

        let items: string[] = fs.readdirSync(targetPath);
        let havePackageJsonFile = false;
        let haveNodeModulesDir = false;

        for (let i = 0; i < items.length; i++) {
            if (items[i] === "package.json") {
                havePackageJsonFile = true;
            } else if (items[i] === "node_modules") {
                haveNodeModulesDir = true;
            }
        }

        if (!havePackageJsonFile) {
            reject(`The given project ${targetPath} doesn't have "package.json" file.`);
            return;
        }

        if (!haveNodeModulesDir) {
            reject(`The given project ${targetPath} doesn't have "node_modules" directory, please execute \`npm install\`.`);
            return;
        }
        utils.readFile(path.join(targetPath, "package.json")).then((buf) => {
            let packageInfoList = new PackageInfoList();
            let packageJsonCtnt = buf.toString("utf8");
            let packageJsonObj = JSON.parse(packageJsonCtnt);
            let projName: string = packageJsonObj["name"] === undefined ? "NotSpecified" : packageJsonObj["name"];
            let projVersion: string = packageJsonObj["version"] === undefined ? "0.1.0" : packageJsonObj["version"];
            let projDependencies: Pair<string, string>[] = packageJsonObj["dependencies"] === undefined ? [] : packageJsonObj["dependencies"];
            let projDevDependencies: Pair<string, string>[] = packageJsonObj["devDependencies"] === undefined ? [] : packageJsonObj["devDependencies"];
            let projPath: string = targetPath;
            let projRootPackageInfo = new PackageInfo(projName, projVersion, projPath, projDependencies, projDevDependencies);

            packageInfoList.push(projRootPackageInfo);

            // Scan the "node_modules" folder
            let nodeModulesPath = path.join(targetPath, "node_modules");
            let packagesPaths = fs.readdirSync(nodeModulesPath);
            let promises: Promise<void>[] = [];

            for (let i = 0; i < packagesPaths.length; i++) {
                let value = packagesPaths[i];
                let packagePath = path.join(nodeModulesPath, value);
                if (!fs.lstatSync(packagePath).isDirectory()) {
                    continue;
                }
                let packageItems = fs.readdirSync(packagePath);
                let packageHavePackageJsonFile = false;
                for (let i = 0; i < packageItems.length; i++) {
                    if (packageItems[i] === "package.json") {
                        packageHavePackageJsonFile = true;
                        break;
                    }
                }
                if (!packageHavePackageJsonFile) {
                    console.warn(`The package ${packagePath} doesn't have "package.json file."`);
                    continue;
                }

                let promise = utils.readFile(path.join(packagePath, "package.json"))
                    .then((buf) => {
                        let jsonCtnt = buf.toString("utf8");
                        let jsonObj = JSON.parse(jsonCtnt);
                        let packageName = jsonObj["name"] === undefined ? "Unknown" : jsonObj["name"];
                        let packageVersion = jsonObj["version"] === undefined ? "0.1.0" : jsonObj["version"];
                        let packageDependencies = jsonObj["dependencies"] === undefined ? [] : jsonObj["dependencies"];
                        let packageDevDependencies = jsonObj["devDependencies"] === undefined ? [] : jsonObj["devDependencies"];
                        let packageInfo = new PackageInfo(packageName, packageVersion, packagePath, packageDependencies, packageDevDependencies);

                        packageInfoList.push(packageInfo);
                    })
                    .catch((err) => {
                        console.error(err);
                    });

                promises.push(promise);
            }
            Promise.all(promises).then(() => {
                resolve(packageInfoList);
                return;
            });
        });
    });
}

/**
 * Analyze a package specified by the `targetPath` and return
 * the generated package wrapped by the Promise.
 * @param targetPath The path of the specific project
 * @returns Serialized as a JSON format string that indicate a
 *          step-by-step dependency graph for a given target item.
 */
export async function analyze(targetPath: string): Promise<Package> {
    // TODO:
    // - [ ] 1. Scan the "node_modules" folder in `targetPath`,
    //    and store all packages(modules) into a list.
    //
    // - [ ] 2. Analyze all packages including the project specified
    //    by `targetPath`.
    //
    // - [ ] 3. Jsonlize.

    //let packagesInfoList: PackageInfoList = 

    return new Promise((resolve, reject) => {
        scanTargetProject(targetPath).then((data) => {
        });
    });
}
