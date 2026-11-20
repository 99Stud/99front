---
name: verify-99front
description: Prove a change works in the running 99Front app. Use after changing the home page, the WebGL scene, SEO metadata, the Payload admin or the signature tool, and before calling such a change done.
---

# Verify 99Front

Run the app, drive the change the way a visitor or team member would, and capture evidence a skeptical reviewer would accept.

## 1. Preflight

Run `pnpm check`. Fix what it reports before opening a browser.

## 2. Launch

```bash
pnpm dev
```

Use the URL `next dev` prints. Three things a fresh checkout or git worktree lacks:

- **Env file**: gitignored, so a worktree has none. Copy it from the main checkout. `PAYLOAD_SECRET` must be set.
- **Local database**: lives under `.wrangler/`, one per checkout. Run `pnpm payload migrate` once to create the tables.
- **First admin user**: an empty local database shows the create-first-user screen at `/admin`. Create a throwaway local user.

Launch is done when `/` responds 200 and the dev server log shows no error.

## 3. Drive

Open [features.md](features.md) and read the section for each area the change touches. Drive every entry point it lists, with the browser tools your harness provides.

## 4. Proof bar

A proof exercises the real user path and shows the observable result.

- Drive through visible UI: click the link, type in the field, press the button. Inspect state with JS only after the user path ran.
- Show the trigger and the stable end state: a screenshot or page text before and after.
- Verify the side effect, not just the pixels: reload and check the value persisted, read the `<head>` tags, read the copied text.
- Cover the paths the change can affect: success, empty, error, logged-out.
- Check the browser console and the dev server log for new errors.

## 5. Workers runtime

`pnpm dev` runs in Node. A change that touches auth, crypto, logging, bindings, or anything in `payload.config.ts` also gets:

```bash
pnpm preview
```

That builds with OpenNext and serves the Worker locally in `workerd`, where Node-only APIs fail the way they would in production.

## 6. Report

State what you drove, what you observed, and what you could not verify. "Could not verify" is a valid line; a guess presented as a check is not.

## Keep the map current

A change that adds, moves or removes a user-visible behaviour updates [features.md](features.md) in the same PR.
