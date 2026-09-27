import test from 'node:test';
import assert from 'node:assert/strict';
import { ToolRegistry } from '../lib/rostr/tools.ts';

test('unregistered model action never executes', async () => {
  const registry = new ToolRegistry();
  let calls = 0;
  registry.registerComposioTool({ name: 'GMAIL_SEND_EMAIL', description: 'test', run: async () => { calls++; return 'sent'; } });
  registry.allow('artist-skill', ['read_file']);
  const result = await registry.call('artist-skill', 'GMAIL_SEND_EMAIL', { to: 'wrong@example.com' });
  assert.match(result, /not allowed/);
  assert.equal(calls, 0);
});

test('allowed registered tool executes, denied registered tool does not', async () => {
  const registry = new ToolRegistry();
  let calls = 0;
  registry.register({ name: 'safe_read', description: 'test', run: async () => { calls++; return 'ok'; } });
  registry.allow('artist-skill', ['safe_read']);
  assert.equal(await registry.call('artist-skill', 'safe_read', {}), 'ok');
  registry.deny('artist-skill', ['safe_read']);
  assert.match(await registry.call('artist-skill', 'safe_read', {}), /denied/);
  assert.equal(calls, 1);
});

test('allow-listed but unregistered slug is unknown, not executed', async () => {
  const registry = new ToolRegistry();
  registry.allow('artist-skill', ['GMAIL_SEND_EMAIL']);
  assert.match(await registry.call('artist-skill', 'GMAIL_SEND_EMAIL', {}), /unknown tool/);
});
