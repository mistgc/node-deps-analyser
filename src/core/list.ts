export class List<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    push(element: T) {
        this.items.push(element);
    }

    remove(index: number) {
        this.items = this.items.filter((_, i) => {
            return index !== i;
        });
    }

    reverse() {
        this.items = this.items.reverse();
    }

    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any ): U[] {
        return this.items.map(callbackfn, thisArg);
    }

    filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] {
        return this.items.filter(callbackfn, thisArg);
    }

    forEach(callbackfn: (value: T, index: number, array: readonly T[]) => void, thisArg?: any) {
        return this.items.forEach(callbackfn, thisArg);
    }
}
