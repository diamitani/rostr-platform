import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const snippet = `import { resolveAuth } from './lib/rostr/auth.ts';
const result = await resolveAuth(new Request('https://example.test/api/v1/runs/x?project_id=artispreneur'), { projectIdFromQuery: 'artispreneur', userIdFromBody: 'other-user' });
console.log(JSON.stringify(result));`;

function authResult(nodeEnv) {
  const env = { ...process.env, NODE_ENV: nodeEnv };
  delete env.SUPABASE_URL;
  return JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', snippet], {
    cwd: process.cwd(), env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  }));
}

test('missing Supabase config is never anonymous production auth', () => {
  assert.deepEqual(authResult('production'), { ok: false, status: 503, error: 'auth_not_configured' });
});

test('missing Supabase config still permits explicit local development mode', () => {
  assert.deepEqual(authResult('development'), {
    ok: true, auth: { user_id: 'other-user', project_id: 'artispreneur', mode: 'dev' },
  });
});
