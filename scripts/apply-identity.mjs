#!/usr/bin/env node
/**
 * Fills the placeholders that cannot be known before you own a repository:
 * package.json's repository/homepage/bugs/author, and the market entry's URLs.
 *
 * Usage:
 *   node scripts/apply-identity.mjs <github-owner> [repo] [flags]
 *
 *   --author "Your Name <you@example.com>"   also writes package.json "author"
 *   --dry-run                                print the result, write nothing
 *
 * Example:
 *   node scripts/apply-identity.mjs octocat
 *   node scripts/apply-identity.mjs octocat dsh-sticky-wall --author "Octo Cat <octo@example.com>"
 */
import fs from 'node:fs';
import path from 'node:path';

const PACKAGE_PLACEHOLDER = 'dsh-sticky-wall';

function parseArgs(argv) {
  const positional = [];
  const flags = { dryRun: false, author: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') flags.dryRun = true;
    else if (arg === '--author') {
      flags.author = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--author=')) flags.author = arg.slice('--author='.length);
    else positional.push(arg);
  }
  return { positional, flags };
}

function fail(message) {
  console.error('error: ' + message);
  process.exit(1);
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const owner = positional[0];
const repo = positional[1] || PACKAGE_PLACEHOLDER;

if (!owner) fail('missing GitHub owner, e.g. `node scripts/apply-identity.mjs octocat`');
if (!/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(owner)) fail('owner looks invalid: ' + owner);
if (!/^[A-Za-z0-9._-]+$/.test(repo)) fail('repo looks invalid: ' + repo);

const root = path.resolve(import.meta.dirname, '..');
const pkgPath = path.join(root, 'package.json');
const entryPath = path.join(root, 'market-entry.yml');
for (const file of [pkgPath, entryPath]) {
  if (!fs.existsSync(file)) fail('not found: ' + file);
}

const base = 'https://github.com/' + owner + '/' + repo;

// ---- package.json ----
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const next = {
  name: pkg.name,
  version: pkg.version,
  type: pkg.type,
  description: pkg.description,
  license: pkg.license,
  author: flags.author || pkg.author,
  repository: { type: 'git', url: 'git+' + base + '.git' },
  homepage: base + '#readme',
  bugs: { url: base + '/issues' },
  keywords: pkg.keywords,
  engines: pkg.engines,
  exports: pkg.exports,
  files: pkg.files,
  dsh: pkg.dsh,
};
for (const key of Object.keys(next)) if (next[key] === undefined) delete next[key];
const pkgText = JSON.stringify(next, null, 2) + '\n';

// ---- market entry ----
let entryText = fs.readFileSync(entryPath, 'utf8');
entryText = entryText
  .replaceAll('/OWNER/', '/' + owner + '/')
  .replaceAll('OWNER/', owner + '/')
  .replaceAll('OWNER', owner)
  .replaceAll(PACKAGE_PLACEHOLDER, repo);

const entryFile = owner + '__' + repo + '.yml';

console.log('owner/repo      ' + owner + '/' + repo);
console.log('package         ' + pkg.name + '@' + pkg.version);
console.log('entry file      ' + 'data/plugins/' + entryFile);
console.log('');

if (flags.dryRun) {
  console.log('--- package.json (dry run) ---');
  console.log(pkgText);
  console.log('--- market-entry.yml (dry run) ---');
  console.log(entryText);
  process.exit(0);
}

fs.writeFileSync(pkgPath, pkgText);
fs.writeFileSync(entryPath, entryText);

console.log('wrote package.json and market-entry.yml');
console.log('');
console.log('Next: copy market-entry.yml into a clone of awesome-dsh-plugin at');
console.log('      data/plugins/' + entryFile);
console.log('      (one file, and never edit the generated READMEs)');
