<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Where things are

- **Check your work**: `pnpm check`, then prove the behaviour in the running app with the `verify-99front` skill.
- **Payload schema or admin components** (collections, globals, custom views): the migration, type and import-map steps are in `README.md`, "CMS (Payload on Cloudflare)".
- **WebGL scene** (`src/webgl/`): read `WEBGL_RENDERING.md` first.
- **Reviewing a diff**: `CODING_STANDARDS.md` holds the judgement calls; lint and Prettier hold the rest.
- **Which skill for which step**: `docs/agents/workflow.md`.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues on `99Stud/99Front`, through the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, names unchanged. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the root, ADRs in `docs/adr/` (created when the first decision is recorded). See `docs/agents/domain.md`.

## Git conventions

- **Branches** follow Conventional Branch: `<type>/<short-kebab-description>`, e.g. `feat/site-seo`, `fix/home-safari-bars`. Types: `feat`, `fix`, `perf`, `refactor`, `docs`, `chore`, `ci`, `test`. Tools often create branches under their own prefix (`claude/...`, `codex/...`); rename the branch to this convention before its first push. Once a PR is open, the branch name is fixed: GitHub closes a PR whose head branch is renamed.
- **Commits and PR titles** follow Conventional Commits: `<type>(<optional scope>): <summary>`, with the same types.
