# 99Front

The public website of [99stud](https://99stud.com).

## Prerequisites

### Node.js

We use [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) to ensure a consistent Node.js version. Install NVM and set the Node.js version for this project with:

```bash
nvm install
```

### Pnpm

Pnpm is the package manager of choice for this project. Make sure you are using at least Node.js 22 _(lts/jod)_ and then activate it through `corepack`:

```bash
corepack enable pnpm
```

To ensure consistent behavior across all development environments, they should all use the same version of pnpm. That's why an explicit pnpm version is specified in the `package.json`. Check if your pnpm version is matching the one under the `packageManager` property:

```bash
pnpm -v
```

If it is not the case, install the corresponding version:

```bash
corepack install
```

## Getting Started

Ensure that you follow the sections below in sequence to set up your development environment without issues.

### Environment Configuration

Initiate by setting up environment variables. Duplicate `.env.local.sample` as `.env.local`:

```bash
cp .env.local.sample .env.local
```

### Dependency Installation

Install necessary project dependencies:

```bash
pnpm install
```

### Dependency Addition & Update (Optional)

To precisely keep track of the dependencies of this application, each dependency should be added with a specific version number:

```bash
pnpm add <pkg> -E
```

Also, for easier dependency updating, you should use the pnpm interactive mode:

```bash
pnpm up -i -L
```

## Running the Application

Execute the app in various modes using:

```bash
# Development mode with fast refresh (runs on port 2499)
$ pnpm dev

# Build the application
$ pnpm build

# Production mode
$ pnpm start
```

## CMS (Payload on Cloudflare)

The site runs on Cloudflare Workers through OpenNext. Payload CMS lives in the same app: the admin is at `/admin`, content is stored in D1 and uploads in R2 (bindings in `wrangler.jsonc`).

- `pnpm dev` uses a local D1 database and R2 bucket under `.wrangler/`. Run `pnpm payload migrate` once to create the tables. `PAYLOAD_SECRET` must be set in `.env`.
- Payload sends its emails (password reset, `payload.sendEmail`) through Resend, from `noreply@cms.99stud.com`. Set `RESEND_API_KEY` in `.env` for local dev, and as a Worker secret in production with `pnpm exec wrangler secret put RESEND_API_KEY`. Without it, sending fails with a Resend 401.
- After changing a collection, run `pnpm payload migrate:create <name>` and `pnpm generate:types`, and commit the results.
- After adding or moving a custom admin component, run `pnpm generate:importmap` and commit the result.
- `pnpm run deploy` applies pending migrations to the remote D1 database, then builds and deploys. The build itself reads the remote database, so it needs `wrangler login`. Use `pnpm run deploy`, not `pnpm deploy`, which is a pnpm built-in.

### Preview deployments

Cloudflare Workers Builds builds every push. On `main` it deploys production; on any other branch it runs `pnpm run build` then `npx wrangler preview`, which publishes a [Worker Preview](https://developers.cloudflare.com/workers/previews/) and posts its URL on the pull request.

- Previews never use production content. They only get the bindings of the `previews` block in `wrangler.jsonc`: the D1 database `99front-preview` and the R2 bucket `99front-media-preview`, shared by all previews. `wrangler.preview.jsonc` exposes the same two resources to the tools that run in Node; keep both files in sync.
- `pnpm run build` is the OpenNext build (it produces `.open-next/worker.js`). When `WORKERS_CI_BRANCH` is set to anything but `main`, it first runs `pnpm run preview:database`, which applies the pending migrations of `src/migrations/` to the preview database, and Payload resolves its build-time bindings from `wrangler.preview.jsonc` instead of the production database. A preview build never opens the production database or bucket, and never runs a migration against them.
- A pull request that adds a migration therefore migrates the shared preview database as soon as it is pushed. Other previews keep running their own code against it, so a destructive migration (dropped or renamed column) can break them until they are rebased. For such a change, create a dedicated database (`wrangler d1 create <name> --location weur`) and point both `previews.d1_databases` in `wrangler.jsonc` and `wrangler.preview.jsonc` at it on that branch only.
- The preview database starts empty: open `/admin` on the preview URL to create its first user. To run the migrations by hand, use `pnpm run preview:database` (needs `wrangler login`).
- Previews have their own `PAYLOAD_SECRET` and `RESEND_API_KEY`, set once each with `pnpm exec wrangler preview base-config secret put <NAME>`. New previews receive them when they are created.
- `WORKER_SELF_REFERENCE` is not bound in previews: a service binding from a preview would call the production Worker.

## Working with coding agents

`pnpm check` runs lint, typecheck and the tests (`pnpm test`, Vitest); CI runs it on every pull request. The flow we follow with agents (which skill at which step, and where each kind of project knowledge lives) is in [docs/agents/workflow.md](docs/agents/workflow.md).
