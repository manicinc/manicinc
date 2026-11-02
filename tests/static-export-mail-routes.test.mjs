// The site is a static export served by GitHub Pages (next.config.js
// `output: 'export'`), so no server runs a route handler. A route that sends
// mail either never runs, or, the day the site is served by a Node server,
// mails whatever address a visitor types. The newsletter lives on
// EmailOctopus (src/components/EmailOctopusForm.tsx), which handles the
// subscription, the confirmation and the unsubscribe itself.
//
// Run after `next build`: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = join(root, '.next', 'app-path-routes-manifest.json');
const requireBuild = process.env.REQUIRE_BUILD_MANIFEST === '1';
const outDir = join(root, 'out');
const expectedFormId = process.env.EXPECT_EMAILOCTOPUS_FORM_ID;
const mailModules = String.raw`resend|@emailjs\/browser|@\/lib\/emailjs`;

function sourceFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) out.push(full);
  }
  return out;
}

function filesUnder(dir, pattern, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) filesUnder(full, pattern, out);
    else if (pattern.test(name)) out.push(full);
  }
  return out;
}

test(
  'the build route list holds no API route',
  { skip: !requireBuild && !existsSync(manifestPath) && 'no .next build output' },
  () => {
    assert.ok(existsSync(manifestPath), 'next build must run before this test');
    const routes = Object.values(JSON.parse(readFileSync(manifestPath, 'utf8')));
    const apiRoutes = routes.filter((r) => r === '/api' || r.startsWith('/api/')).sort();
    assert.deepEqual(apiRoutes, []);
  },
);

test('no route handler under src/app/api', () => {
  assert.equal(existsSync(join(root, 'src', 'app', 'api')), false);
});

test('no source file calls a mail route or a mail-sending library', () => {
  const offenders = [];
  for (const file of sourceFiles(join(root, 'src'))) {
    const text = readFileSync(file, 'utf8');
    if (
      /['"`]\/api\/(subscribe|unsubscribe|newsletter|contact)\b/.test(text) ||
      new RegExp(`(?:from|import|require)\\s*\\(?\\s*['"](?:${mailModules})['"]`).test(text)
    ) {
      offenders.push(relative(root, file));
    }
  }
  assert.deepEqual(offenders, []);
});

test('the mounted newsletter form is the EmailOctopus embed', () => {
  const section = readFileSync(join(root, 'src', 'components', 'NewsletterSection.tsx'), 'utf8');
  assert.match(section, /import\(['"]\.\/EmailOctopusForm['"]\)/);
  const form = readFileSync(join(root, 'src', 'components', 'EmailOctopusForm.tsx'), 'utf8');
  assert.match(form, /https:\/\/eocampaign1\.com\/form\//);
});

test(
  'the built newsletter page renders the EmailOctopus form, not the fallback',
  { skip: !requireBuild && !existsSync(outDir) && 'no static export output' },
  () => {
    assert.ok(expectedFormId, 'build with NEXT_PUBLIC_EMAILOCTOPUS_FORM_ID and set EXPECT_EMAILOCTOPUS_FORM_ID');
    const pages = filesUnder(outDir, /\.html$/).filter((f) => /^newsletter(\/index)?\.html$/.test(relative(outDir, f)));
    assert.ok(pages.length > 0, 'out/ holds no newsletter page');
    for (const page of pages) {
      assert.doesNotMatch(readFileSync(page, 'utf8'), /Newsletter form unavailable/);
    }
    const chunks = filesUnder(join(outDir, '_next', 'static'), /\.js$/);
    assert.ok(
      chunks.some((f) => readFileSync(f, 'utf8').includes(expectedFormId)),
      'no client chunk carries the form id passed to EmailOctopusForm',
    );
    assert.ok(
      chunks.some((f) => readFileSync(f, 'utf8').includes('eocampaign1.com/form/')),
      'no client chunk loads the EmailOctopus embed',
    );
  },
);
