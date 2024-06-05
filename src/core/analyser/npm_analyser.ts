import { Analyser, AnalyserType } from ".";
import * as utils from "../utils";
import fs from "fs"
import path from "path"

type Pair<K, V> = utils.Pair<K, V>;

export class NpmAnalyser implements Analyser {
    targetPath: string = "";
    necessaryFilesName: string[] = [
        "package.json",
    ];

    getType(): AnalyserType {
        return AnalyserType.NpmAnalyser;
    }

    setTargetPath(path: string): boolean {
        let result = true;

        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`Project ${path} does not exist.`);
                result = false;
            }
        });

        return result;
    }

    analyze(targetPath: string): Promise<Package> {
        return new Promise((resolve, reject) => {
            if (this.setTargetPath(targetPath) === false) {
                reject(`Project ${targetPath} is not analyzed.`);
            }

            let items = fs.readdirSync(targetPath);

            if (this.verify(items) === false) {
                reject(`Project ${targetPath} `);
            }

            let packageJsonPath = path.join(this.targetPath, "package.json");

            utils.readFile(packageJsonPath)
                .then((buf) => {
                    let packageJsonCtnt = buf.toString("utf8");
                    let packageObj = JSON.parse(packageJsonCtnt);
                    let dependencies: Pair<string, string>[] = packageObj["dependencies"];
                    let devDependencies: Pair<string, string>[] = packageObj["devDependencies"];

                    dependencies.forEach((value, index) => {
                    });

                    devDependencies.forEach((value, index) => {
                    });
                });
        });
    }

    private verify(items: string[]): boolean {
        let numNecessaryFiles: number = this.necessaryFilesName.length;

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < this.necessaryFilesName.length; j++) {
                if (items[i] === this.necessaryFilesName[j]) {
                    numNecessaryFiles -= 1;
                }
            }
        }

        return numNecessaryFiles === 0;
    }
}
