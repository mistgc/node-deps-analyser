import fs from "fs";

export function readFile(file_path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(file_path, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

export class Pair<K, V> {
    k: K;
    v: V;

    constructor(k: K, v: V) {
        this.k = k;
        this.v = v;
    }
}
