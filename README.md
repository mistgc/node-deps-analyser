<div align="center">
    <h1>node-deps-analyser (nda)</h1>
</div>


## Usage

```plaintext
Usage: node ./build/index.js [option] <target path>
       nda [option] <target path>

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
```

## Development

```bash
git clone github.com/mistgc/node-deps-analyser.git
cd node-deps-analyser
yarn
```
