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

## UI & Design Philosophy (Gamified "Impeccable" Style)

This project adopts a highly gamified, "Duolingo-style" interface design philosophy for its celebratory and core workout components. Treat these principles as invariant when maintaining or creating new UI:

- **Thick 3D Borders & Shadows:** Interactive elements (buttons, cards) must feel tangible. Use solid, thick borders (`border-[3px]` or `border-[4px]`) combined with prominent bottom shadows/borders (e.g., `border-b-[6px]` or `shadow-[0_6px_0_color]`) to create depth.
- **Vibrant & Semantic Colors:** Rely on high-contrast, fully saturated colors.
  - Green (Success/Action): `#58CC02`
  - Yellow (Volume/Warning): `#FFC800`
  - Blue (Time/Duration): `#1CB0F6`
  - Orange/Gold (PRs/Achievements): `#FF8C42` / `#FFD700`
- **Typography:** Display headings should be massive (`text-4xl` to `text-[40px]`), `font-black`, and often utilize CSS text-stroke (`WebkitTextStroke`) and heavy drop shadows to stand out against colorful backgrounds.
- **Card Structures (Split-Tone):** Major milestone cards (like `WorkoutComplete`) avoid being just flat white. They use a split structure: a vibrant gradient top-half (e.g., Mint Green) that blends with the page background, and a structured white bottom-half for dense numerical data.
- **Motion & Joy:** Loading states and transitions should be fluid. Always incorporate Lottie animations (e.g., confetti) and the mascot (`DuckDepositTank`) when the user completes a task or achieves a PR.
