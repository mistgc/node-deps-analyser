import { Format } from "@ts-graphviz/adapter";
import { analyze } from "../core";
import { generateGraphsImageStream } from "../graphviz";
import * as fs from "fs";
import * as path from "path";

let helpText = ` Usage: ${process.argv0} <command>

Commands:
    analyze [option] <target path>: ...

Options:
    --json
    --type <type>

Type:
    svg, png, jpg.
`;

export function cli(argv: string[]) {
    if (argv[0] === "analyze") {
        if (argv.length === 2) {
            analyze(argv[1]).then((p) => {
                generateGraphsImageStream(p).then((istream) => {
                    let ostream = fs.createWriteStream(path.join(".", "output.svg"));
                    istream.pipe(ostream);
                    ostream.on("finish", () => {
                        console.log("Done!");
                    });
                });
            });
        } else if (argv.length === 3) {
            if (argv[1].localeCompare("--json") === 0) {
                analyze(argv[2]).then((p) => {
                    console.log(JSON.stringify(p))
                });
            }
        } else if (argv.length === 4) {
            if (argv[1].localeCompare("--type") === 0) {
                analyze(argv[1]).then((p) => {
                    // TODO:
                    //let format: Format.values = "png";
                    //generateGraphsImageStream(p, format).then((buf) => {
                    //    //fs.writeFileSync(`./output.${argv[2]}`, buf);
                    //});
                });
            }
        }
    }
}
