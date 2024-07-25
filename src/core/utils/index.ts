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

export function verifyIfDirContainItems(dirPath: string, necessaryItems?: string[]): boolean {
    let result = true;

    if (!fs.existsSync(dirPath) && !fs.lstatSync(dirPath).isDirectory()) {
        result = false;
    } else if (necessaryItems !== undefined) {
        let items = fs.readdirSync(dirPath);
        let count = necessaryItems.length;

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < necessaryItems.length; j++) {
                if (items[i] === necessaryItems[j]) {
                    count -= 1;
                }
            }
        }

        result = count === 0;
    }

    return result;
}

export class Pair<K, V> {
    k: K;
    v: V;

    constructor(k: K, v: V) {
        this.k = k;
        this.v = v;
    }
}
