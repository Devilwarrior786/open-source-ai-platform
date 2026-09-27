# OpenForge — The Open-Source AI Platform

An open-source AI platform starter: a themed landing page, password auth, and a realtime
chat playground over open-weight models, built with **React + Vite + Tailwind + Convex**.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, lucide-react
- **Backend:** [Convex](https://convex.dev) — functions, realtime database, scheduled jobs
- **Auth:** [Convex Auth](https://labs.convex.dev/auth) — password (email + password) provider
- **AI:** Mistral AI API (open-weight models), called server-side from a Convex action

## Structure

```
src/
  routes/          # Landing, auth, and dashboard pages
  components/      # Shared UI (shadcn-style primitives, chat playground)
  lib/             # Utilities
  convex/          # Backend: schema, auth, chats, AI action
```

## Getting started

```sh
bun install
bun convex dev --once   # push Convex functions + regenerate types
bun run dev             # start Vite (binds 0.0.0.0, respects $PORT)
```

### Environment

| Variable           | Where                 | Purpose                                     |
| ------------------ | --------------------- | ------------------------------------------- |
| `VITE_CONVEX_URL`  | `.env.local` (client) | Convex deployment URL                       |
| `JWT_PRIVATE_KEY`  | Convex env (server)   | Convex Auth JWT signing key (private)       |
| `JWKS`             | Convex env (server)   | Convex Auth JWT signing key (public JWKS)   |
| `MISTRAL_API_KEY`  | Convex env (server)   | Model inference for the playground (opt.)   |
| `MISTRAL_MODEL`    | Convex env (server)   | Optional model override (default `mistral-small-latest`) |

Generate and push the auth keys with:

```sh
node scripts/generate-auth-keys.mjs --push
```

Without `MISTRAL_API_KEY` the playground still works end-to-end and replies with a
setup notice — chats and messages persist either way.

## License

Apache-2.0
