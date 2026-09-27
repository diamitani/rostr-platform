import test from 'node:test';
import assert from 'node:assert/strict';
import { SupabaseHub } from '../lib/rostr/hub.ts';
const uid = '12345678-1234-4234-8234-123456789abc';
const other = '87654321-1234-4234-8234-123456789abc';

test('hub never accepts unverified or absent user binding', () => {
  assert.throws(() => new SupabaseHub('https://example.test','key','api_key'));
  assert.throws(() => new SupabaseHub('https://example.test','',uid));
});

test('all run reads and writes bind user and project; wrong ownership cannot overwrite', async () => {
  const oldFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body });
    if (init.method === 'POST') return Response.json([{ id: 'ok' }]);
    if (init.method === 'PATCH') return Response.json([]);
    return Response.json([]);
  };
  try {
    const hub = new SupabaseHub('https://example.test','private',uid);
    const run = await hub.createRun('artispreneur','artie','test');
    assert.equal(run.id.length,36);
    assert.equal(JSON.parse(calls[0].body).user_id,uid);
    assert.equal(await hub.getRun('artispreneur',run.id),null);
    assert.match(calls[1].url,new RegExp(`user_id=eq\\.${uid}`));
    assert.match(calls[1].url,/project_id=eq.artispreneur/);
    await assert.rejects(() => hub.updateRun('different',run),/project mismatch/);
    await assert.rejects(() => hub.updateRun('artispreneur',run),/not found or not owned/);
    assert.equal(await hub.checkEntitlement(other,'artispreneur','epk'),false);
    assert.equal(calls.length,3);
  } finally { globalThis.fetch = oldFetch; }
});
