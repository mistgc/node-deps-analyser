import { Package } from "../core/package";
import { toStream, Format } from "@ts-graphviz/adapter";
import * as graphviz from "ts-graphviz";
import { attribute as attr } from "ts-graphviz";

export function generateGraphsImageStream(root: Package, format: Format.values = "svg"): Promise<NodeJS.ReadableStream> {
    let g = new graphviz.Digraph();

    let lambda = (p: Package): graphviz.Node => {
        let node = new graphviz.Node(`${p.name}@${p.version}`);
        g.addNode(node);

        p.deps.forEach((dep) => {
            g.createEdge([node, lambda(dep)]);
        });

        p.devDeps.forEach((dep) => {
            g.createEdge([node, lambda(dep)], {
                [attr.color]: "blue"
            });
        });

        return node;
    };

    lambda(root);
    let dot = graphviz.toDot(g);
    return toStream(dot, { format: format });
}
