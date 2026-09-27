import test from 'node:test';
import assert from 'node:assert/strict';
import { compileManifest, validateManifest } from '../lib/rostr/pal.ts';
const agent = { id: 'artie', name: 'Artie', systemPrompt: '', skills: [] };

test('PAL emits typed criteria, escalation, memory scope and explicit tool denies', () => {
  const manifest = compileManifest({projectId:'artispreneur', agent, goal:'Create an EPK', context:'verified artist source'});
  assert.equal(manifest.version,1);
  assert.match(manifest.retrievedContext,/verified artist source/);
  assert.equal(manifest.escalationPolicy,'require-approval');
  assert.equal(manifest.memoryScope,'project');
  assert.ok(manifest.completionCriteria.length);
  assert.ok(manifest.deniedTools.includes('write_file'));
  assert.doesNotThrow(() => validateManifest(manifest));
});

test('a denied effect or malformed compile fails before worker execution', () => {
  const m = compileManifest({projectId:'artispreneur', agent, goal:'Create an EPK'});
  assert.throws(() => validateManifest({...m, allowedTools:['read_file','write_file']}),/allow\/deny conflict/);
  assert.deepEqual(compileManifest({projectId:'artispreneur',agent,goal:'EPK',allowedTools:['write_file','read_file']}).allowedTools,['read_file']);
  assert.throws(() => validateManifest({...m, version:2}),/invalid PAL manifest/);
  assert.throws(() => validateManifest({...m, maxSteps:0}),/invalid PAL manifest/);
});
