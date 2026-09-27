import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync('app/api/v1/health/route.ts','utf8');
test('health is configuration-only and reports the Artispreneur flag separately', () => {
  assert.match(source,/ARTISPRENEUR_ROSTR_ENABLED/);
  assert.match(source,/const ready = !mock && authConfigured && hubConfigured && enabled/);
  assert.match(source,/artispreneur_enabled: enabled/);
});
const run = readFileSync('app/api/v1/run/route.ts','utf8');
test('production Artispreneur run remains disabled without explicit enablement and JWT', () => {
  assert.match(run,/auth\.auth\.mode !== "jwt"/);
  assert.match(run,/ARTISPRENEUR_ROSTR_ENABLED/);
  assert.match(run,/model_not_configured/);
});
