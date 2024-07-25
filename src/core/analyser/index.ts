import { PackageInfoList } from "../package_info";
import { NpmAnalyser } from "./npm_analyser";
import { Package } from "../package";

export enum AnalyserType {
    NpmAnalyser,
    YarnAnalyser,
    PnpmAnalyser,
}

export interface Analyser {
    /**
     * Get the type of the analyser.
     * @returns The type of the analyser
     */
    getType(): AnalyserType;

    /**
     * Analyze a package specified by the `packagePath` and return the package wrapped by the Promise.
     * @param packagePath The path of the specific project
     * @returns The root package wrapped by the Promise
     */
    analyze(packageInfoList: PackageInfoList): Promise<Package>;
}

export class AnalyserFactory {
    static createAnalyser(analyzeType: AnalyserType): Analyser {
        switch(analyzeType) {
            default:
                return new NpmAnalyser();
        }
    }
}
