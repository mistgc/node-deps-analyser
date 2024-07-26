import { Format } from "@ts-graphviz/adapter";
import { analyze } from "../core";
import { generateGraphsImageStream } from "../graphviz";
import * as fs from "fs";

let helpText = ` Usage: nda [option] <target path>

Options:
    -J, --json
    -F, --format <format>
    -O, --output <output path>

Format:
    svg, png, jpg.

Examples:
    nda --json ./node-deps-analyser
    nda ./node-deps-analyser
    nda --format png --output /tmp/output.png ./node-deps-analyser
`;

class CliOpts {
    public targetPath: string;
    public json: boolean;
    public format: Format.values;
    public outputPath: string;

    constructor(targetPath: string, json: boolean = false, format: Format.values = "svg", outputPath: string = "./output.svg") {
        this.targetPath = targetPath;
        this.json = json;
        this.format = format;
        this.outputPath = outputPath;
    }

    public static fromArgv(argv: string[]): CliOpts {
        let targetPath = argv[argv.length - 1];

        if (!fs.existsSync(targetPath)) {
            console.log(helpText);
            console.error(`The target path ${targetPath} doesn't exist.`);
            process.exit(-1);
        }

        let opts = new CliOpts(targetPath);

        for (let i = 0; i < argv.length; i++) {
            let arg = argv[i];

            if (arg.localeCompare("--json") === 0 || arg.localeCompare("-J") === 0) {
                opts.json = true;
            } else if (arg.localeCompare("--format") === 0 || arg.localeCompare("-F") === 0) {
                if (i + 1 >= argv.length) {
                    console.log(helpText);
                    console.error("Pass a kind of format to the option \"--format\", please.");
                    process.exit(-1);
                }

                let value = argv[i + 1];

                if (value.localeCompare("svg") === 0) {
                    opts.format = "svg";
                } else if (value.localeCompare("png") === 0) {
                    opts.format = "png";
                } else if (value.localeCompare("jpg") === 0) {
                    opts.format = "jpg";
                } else {
                    console.log(helpText);
                    console.error("The value passed to the option \"-F | --format\" is invalid.");
                    process.exit(-1);
                }
            } else if (arg.localeCompare("--output") === 0 || arg.localeCompare("-O") === 0) {
                if (i + 1 >= argv.length) {
                    console.log(helpText);
                    console.error("Pass a path to the option \"-O | --output\", please.");
                    process.exit(-1);
                }
                let value = argv[i + 1];
                opts.outputPath = value;
            }
        }

        return opts;
    }
}

export function cli(argv: string[]) {
    let start = Date.now();
    let opts = CliOpts.fromArgv(argv);

    if (opts.json) {
        analyze(opts.targetPath).then((p) => {
            console.log(JSON.stringify(p));
        });
    } else {
        analyze(opts.targetPath).then((p) => {
            generateGraphsImageStream(p, opts.format).then((imageStream) => {
                let fileStream = fs.createWriteStream(opts.outputPath);
                imageStream.pipe(fileStream);
                fileStream.on("finish", () => {
                    console.log(`Done! (${(Date.now() - start) / 1000}s)`);
                });
            });
        });
    }
}
