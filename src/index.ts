import { analyze } from "./core"

let argv = process.argv.slice(2);

if (argv.length === 2) {
    if (argv[0] === "analyze") {
        analyze(argv[1]).then((p) => {
            console.log(JSON.stringify(p))
        });
    }
}
