import { build } from "esbuild";
import { writeFile, readFile } from "node:fs/promises";

await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    format: "cjs",
    minify: true,
});

await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.mjs",
    format: "esm",
    minify: true,
});
