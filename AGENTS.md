# Agent Notes

This project deploys to Cloudflare Workers through OpenNext. Treat these notes as
operational invariants before changing, diagnosing, or deploying production code.

## Production

- Canonical production URL: `https://louvrerobbery.uk`
- Cloudflare Worker script: `workout-app`
- Cloudflare D1 database: `workout-db`
- The custom domain is served by Worker routes for `louvrerobbery.uk/` and
  `louvrerobbery.uk/*`. Do not replace the user-facing URL with a `workers.dev`,
  `pages.dev`, or Vercel URL unless the user explicitly asks to change hosting.
- A `pages.dev` hostname can appear in Cloudflare DNS or diagnostics, but it is
  not the canonical production URL for user verification.

## Deploy

- Use `npm run deploy:cf` or `npm run deploy`.
- Do not run `wrangler pages deploy .open-next`; `.open-next` is a Cloudflare
  Worker bundle, not a Pages static output.
- Apply required remote D1 migrations before deploying code that depends on new
  tables or columns.
- Do not commit Cloudflare tokens, Better Auth secrets, or other credentials.

## Post-Deploy Verification

Verify the custom domain, not only the worker subdomain:

```bash
curl -I https://louvrerobbery.uk/
curl -i https://louvrerobbery.uk/api/health
curl -i https://louvrerobbery.uk/api/goals/review
```

Unauthenticated protected endpoints should return `401`, not `500`.
