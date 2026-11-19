# Real effect tools: email_send + publish — 2026-11-18 (evening)

Owner call: "Yes build everything real for Artispreneur agent"
(phonemsg-01M7RP6VF67ECXG18CBJKKYTF5). Built real email_send and publish
for rostr over Composio, with a mandatory confirm-before-write hook. No
charge/money tools built (flagged to main). Tested only against his own
mailboxes; nothing was sent to any outside person.

## Design

- `registerEffectTool` + `setEffectConfirmer` in the registry: an effect
  tool cannot execute unless a confirmation hook approves THAT call
  (approval is never cached; no hook -> hard refusal). The hook sees the
  tool name and full arguments; the model and the manifest have no
  authority here.
- `attachComposioEffectTool` binds one write-capable Composio slug to one
  specific connected account (owner-scoped: the caller resolves which
  account belongs to which user) and registers it as an effect tool.
- Composio execute now sends `entity_id` (the API requires it with a
  connected account) and serializes structured errors properly (was
  printing "[object Object]").
- Driver test policy (scripts/e2e-live-run.ts, E2E_EFFECTS=1): the
  confirmer approves ONLY mail to the owner's own mailboxes with a
  "[rostr test]" subject prefix and refuses everything else with a reason.

## Live proof (no mocks)

- email_send: run 53e2dc03 — the agent sent a real email from the working
  Gmail connection (artispreneur@gmail.com, Composio account ca_CrvnK0QTM-hD)
  to his own mailbox. Gmail response: labelIds ["SENT"], message id
  1a1f1669f84a0ad7. One test email total.
- Negative test (same machinery): recipient someone.else@example.com was
  REFUSED by the hook — "effect tool 'email_send' was not confirmed:
  recipient ... is not an owner mailbox" — before any provider call.
- publish: run a52191e9 (status done) — created a real Gmail DRAFT
  (labelIds ["DRAFT"], draft id in record). An earlier attempt
  (fb80dea9) also created a draft (r214388464347808056) before the run
  died on a transient empty model response; the slug was wrong in the
  first binding (GMAIL_CREATE_DRAFT does not exist; the v3 slug is
  GMAIL_CREATE_EMAIL_DRAFT — found by listing the live toolkit).

Two drafts and one sent test email now sit in the connected mailboxes as
artifacts of the proof; both are "[rostr test]" labeled and safe to delete.

## Honest scope

- "publish" is bound to draft creation for the live test because it is the
  only effect with a zero-external-impact target among his ACTIVE Composio
  connections (the other active one is Framer, whose publish would touch a
  live site). Binding publish to a real platform = same tool, different
  slug + connection, his per-action call.
- The second ACTIVE Gmail connection (ca_ouhuyGgjnTjO) is actually broken
  (Google 401 invalid credentials) despite showing ACTIVE — worth him
  reconnecting or removing it in Composio.
- Charge/money tools: not built, flagged to main per policy.
