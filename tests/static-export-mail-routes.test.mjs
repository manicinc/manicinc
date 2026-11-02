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

function sourceFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) out.push(full);
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
      /from\s+['"](resend|@emailjs\/browser|@\/lib\/emailjs)['"]/.test(text)
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
