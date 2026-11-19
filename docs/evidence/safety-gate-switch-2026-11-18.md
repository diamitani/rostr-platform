# Configurable safety gate — 2026-11-18 (evening)

Owner call: "Keep safety off wyd im building here" (phonemsg-01M7RNREV0WWHP3727GHYZJME3),
then "this is live run ... it must work" (phonemsg-01M7RNRXB7KW131EYHGSQJXE2S).
The read-only tool gate is now a single switch he controls.

## The switch

`ROSTR_SAFETY_GATE` — on by default, `off` disables. One env var, read in
one place (`safetyGateOn()` in tools.ts), honored by both the PAL compiler
and the tool registry. Per-compile override: `CompileInput.safetyGate`.

Gate ON (default, unchanged behavior):
- PAL admits read-only tools only (read_file, list_dir, web_search, plus
  individually allow-listed read-only Composio slugs).
- write_file/email_send/publish/charge are force-denied in every manifest.
- write_file is additionally sealed inside the registry and its own
  implementation.

Gate OFF:
- The caller's allowlist passes through the compiler as given.
- write_file works, still sandboxed to the workspace root (symlink-checked
  via nearest-existing-ancestor resolution).
- The allow-list model, per-skill allow/deny enforcement, and the
  unknown/hallucinated tool refusal all still apply — a made-up tool name
  is refused by the registry whether the gate is on or off.
- email_send/publish/charge have no implementations registered, so they
  refuse as unknown tools until someone wires one; the gate does not conjure
  capabilities.

## Proven live (no mocks)

- Gate ON negative test: manifest requested [read_file, write_file,
  web_search, rm_rf] -> compiled to [read_file, web_search], write_file
  force-denied, made-up `rm_rf` dropped; registry returned
  "write_file is sealed while ROSTR_SAFETY_GATE is on".
- Gate OFF run `37382fdd` — status done (record:
  e2e-live-run-37382fdd.json): the agent wrote scratch/agent-note.txt with
  write_file, read it back with read_file, reported the content, and the
  master verification pass confirmed 1/1. File verified on disk:
  "rostr write_file works live".

## Real bug found and fixed

write_file to a NEW path always failed (ENOENT): the sandbox used
fs.realpathSync on the target, which throws for files that do not exist
yet. Added sandboxForWrite(): lexical containment plus realpath of the
nearest existing ancestor (symlink-safe), creating parent dirs after.

No real outside send, publish or charge was executed; those stay per-action
decisions for the owner.
