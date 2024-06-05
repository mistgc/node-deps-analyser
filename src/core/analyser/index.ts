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
    analyze(packagePath: string): Promise<Package>;
}
