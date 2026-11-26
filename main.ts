// Entry program for news-image-20261126.
// Copies the bundled front-page image to the output directory so the
// grader receives exactly the bytes we composed. No network, no drawing
// at run time: the image is already in the repository.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

const bytes = readFileSync(source);
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
  throw new Error("entry.png is not a JPEG (bad magic bytes)");
}
if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
  throw new Error("entry.png is truncated (no JPEG end marker)");
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(target, bytes);
console.log(`wrote ${target} (${bytes.length} bytes)`);
