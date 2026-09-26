// Builds the single-file bundle at the repo root: divot.css = banner + tokens + core.
// No dependencies. `node scripts/build.mjs` writes it; `--check` only compares and
// exits 1 when the committed bundle is stale.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const pkg = JSON.parse(read('package.json'));

const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} | ${pkg.homepage}
   A simple skeuomorphic button style. Tokens + the core primitive in one file:
     <link rel="stylesheet" href="divot.css">
     <button class="divot">Edit</button>
*/
`;

const out = banner + '\n' + read('css/tokens.css') + '\n' + read('css/core.css');
const target = resolve(root, 'divot.css');

if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(target, 'utf8'); } catch {}
  if (current !== out) {
    console.error('divot.css is stale: run `npm run build` and commit the result.');
    process.exit(1);
  }
  console.log('divot.css is up to date.');
} else {
  writeFileSync(target, out);
  console.log(`wrote divot.css (${Buffer.byteLength(out)} bytes)`);
}
