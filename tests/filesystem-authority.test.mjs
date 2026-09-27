import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ToolRegistry } from '../lib/rostr/tools.ts';
import { compileManifest } from '../lib/rostr/pal.ts';

test('model cannot write even when a manifest allow-lists write_file', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rostr-write-'));
  const dest = path.join(root, 'mutation.txt');
  const registry = new ToolRegistry();
  registry.allow('artist', ['write_file']);
  const result = await registry.call('artist', 'write_file', { path: dest, content: 'mutated' });
  assert.match(result, /requires human approval/);
  assert.equal(fs.existsSync(dest), false);
  fs.rmSync(root, { recursive: true, force: true });
});

test('default manifest only offers read-only tools', () => {
  const agent = { id: 'artist', name: 'Artist', systemPrompt: '', skills: [] };
  const m = compileManifest({ projectId: 'artispreneur', agent, goal: 'Create an EPK' });
  assert.deepEqual(m.allowedTools, ['read_file', 'list_dir']);
});

test('file reads do not follow a symlink outside the workspace', async () => {
  const root = process.cwd();
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rostr-private-'));
  const marker = path.join(outside, 'private.txt');
  const link = path.join(root, `.rostr-symlink-test-${process.pid}`);
  try {
    fs.writeFileSync(marker, 'SECRET TEST MARKER');
    fs.symlinkSync(outside, link);
    const registry = new ToolRegistry();
    registry.allow('artist', ['read_file', 'list_dir']);
    const read = await registry.call('artist', 'read_file', { path: `${path.basename(link)}/private.txt` });
    const list = await registry.call('artist', 'list_dir', { path: path.basename(link) });
    assert.match(read, /escapes workspace root/);
    assert.match(list, /escapes workspace root/);
    assert.doesNotMatch(read, /SECRET TEST MARKER/);
  } finally {
    fs.rmSync(link, { force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});
