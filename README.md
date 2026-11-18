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
- After changing a collection, run `pnpm payload migrate:create <name>` and `pnpm generate:types`, and commit the results.
- `pnpm run deploy` applies pending migrations to the remote D1 database, then builds and deploys. The build itself reads the remote database, so it needs `wrangler login`. Use `pnpm run deploy`, not `pnpm deploy`, which is a pnpm built-in.
