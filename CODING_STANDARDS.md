# Coding standards

Read at **review** time (`/mattpocock-skills:code-review` picks this file up), not while implementing. It holds the judgement calls only: anything ESLint, Prettier or `tsc` already enforces stays out. When a rule here turns out to be mechanical, replace it with a lint rule and delete it.

These were derived from the code as it stood in November 2026. A rule the team doesn't hold is a bug in this file: delete it.

## Trust boundaries

- **Every Server Function and custom admin view checks the login itself.** Payload guards its own routes, not ours; see `saveSignatureLinks` and `SignatureView`.
- **A Local API write made for a user passes `overrideAccess: false` and `user`**, so the collection's access rules apply. See `saveSignatureLinks`.
- **A Server Function validates the shape of its arguments** before using them, and re-reads the data it is about to change instead of trusting what the page sent.
- **A CMS field rendered as a link target is validated to `https`** in the field config.

## Public pages keep rendering

- A public page that reads the CMS catches a failed read, logs it, and renders the **built-in defaults**. See `getSocialLinks` and `getPageMetadata`.

## Payload and data

- **A schema change ships whole in one PR**: the collection or global, its migration, and the regenerated `src/payload-types.ts`.
- **Generated files are regenerated, never hand-edited**: `src/payload-types.ts`, `src/migrations/**`, `src/app/(payload)/**`, `cloudflare-env.d.ts`.
- **A destructive migration** (dropped or renamed column) says so in the PR body, because every open **preview** shares the **preview data**. The README describes the dedicated-database route.
- **Previews stay off production.** A change to bindings touches `wrangler.jsonc` (`previews` block) and `wrangler.preview.jsonc` together, and adds no path from a preview build to the production database or bucket.

## Workers runtime

- Code that runs in the deployed Worker uses Web APIs. A Node-only API (`fs`, `pino`'s file writes, heavy `crypto` parameters) needs a comment naming where it runs instead (CLI, `next build`, `next dev`).

## Structure

- **Components** live at `src/components/<area>/<Name>/index.tsx`, with their styles inside that folder as `<Name>.module.scss`. Page-specific ones go under `pages/<Page>/`, admin ones under `admin/`.
- **Rules and data transformations** live in `src/lib/pages/<Page>/` or `src/lib/<topic>/`, as small pure functions the component imports. `signature.ts` and `signatureLinks.ts` are the model: the component holds state, the lib holds the rules.
- **New names come from `GLOSSARY.md`.** A new domain word in a diff either matches the glossary or is added to it in the same PR.

## Tests

- A test sits beside the file it covers, as `<name>.test.ts`, and runs in Node with no database, browser or network.
- A test names a behaviour a team member or visitor would recognise ("lists 99stud.com first"), and asserts through the module's exported functions.
- New rules in `src/lib/` arrive with a test. Components, the scene and the admin are proven with `verify-99front` instead.

## Comments

- A comment states **why**: the platform limit, the security reason, the mail-app quirk, the Payload behaviour that forced the shape. Code whose reason is obvious carries none.

## WebGL scene

- Animation advances on the **tick** (`site:tick` through the shared `Emitter`), never on its own `requestAnimationFrame`.
- Per-frame code reuses its vectors, colours and arrays. Allocation belongs in setup.
- Every asset an **entity** uses is declared in the **manifest**.

## Dependencies

- A new dependency is justified in the PR body: what the platform or an installed package could not do.
