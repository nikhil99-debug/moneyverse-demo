# Deploying MoneyVerse + the public `/demo`

This app is a Next.js 16 / React 19 project. The **public demo lives at `/demo`**,
is fully client-side (localStorage), and needs no backend. The rest of the app
(auth, payments, DB) needs the environment variables in `.env.example`.

> The demo works even before Clerk/Supabase/Razorpay are configured, because
> `/demo` and `/demo-modules/*` are short-circuited to public in `proxy.ts` and
> never touch those services.

---

## 1. Push to a private GitHub repo

You already created a repo named **money verse demo**. From the project folder:

```bash
cd moneymania-learn

# safety: confirm no secrets are staged (should print nothing)
git status --porcelain | grep -i '\.env\.local' || echo "OK - no .env.local staged"

git add -A
git commit -m "MoneyVerse: add public /demo"

# add your repo (HTTPS or SSH). Replace with the real URL:
git remote add origin https://github.com/<your-user>/<money-verse-demo>.git
git branch -M main
git push -u origin main
```

Notes:
- `.gitignore` already ignores all `.env*` files (secrets never leave your machine)
  except the safe `.env.example` template.
- Make sure the GitHub repo visibility is **Private**.

---

## 2. Import into Vercel

1. Go to <https://vercel.com/new> and **Import** the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Leave build/output defaults:
   - Build command: `next build`
   - Install command: `npm install`
3. Do **not** deploy yet — add environment variables first (next step), then deploy.

Vercel Analytics is already wired in the demo (`@vercel/analytics`). It turns on
automatically once deployed on Vercel; enable **Analytics** in the project's
Vercel dashboard to see events (`demo_opened`, `character_started`,
`chapter_completed`, `reset_clicked`, `contact_clicked`, each carrying `ref`).

---

## 3. Set environment variables (Vercel → Project → Settings → Environment Variables)

Add every key from `.env.example` for the **Production** (and Preview) environment.
Copy the *values* from your local `.env.local`:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk **production** publishable key |
| `CLERK_SECRET_KEY` | Clerk **production** secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk production webhook signing secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | e.g. `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | e.g. `/sign-up` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** — server only |
| `RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | **Secret** |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key id |
| `NEXT_PUBLIC_APP_URL` | Final URL, e.g. `https://demo.outchase.in` (used for OG/canonical) |

Then click **Deploy**.

> If you only want the demo live and haven't set up Clerk/Supabase/Razorpay yet,
> you can deploy with placeholder values — `/demo` will still work. Do **not**
> visit `/dashboard` or the auth pages until real Clerk keys are set.

---

## 4. Set up a production Clerk instance

1. In the [Clerk dashboard](https://dashboard.clerk.com), create a **Production**
   instance (separate from Development).
2. Copy its **Publishable key** and **Secret key** into the Vercel env vars above.
3. Add your production domain(s) under Clerk → **Domains** (e.g. `outchase.in`,
   and the demo subdomain if auth is ever used there).
4. Webhooks → create an endpoint pointing at `https://<your-domain>/api/webhooks/clerk`,
   copy its **Signing secret** into `CLERK_WEBHOOK_SECRET`.
5. Redeploy so the new env vars take effect.

(The demo itself never calls Clerk, so this is only needed for the full app.)

---

## 5. Connect a custom subdomain (`demo.<domain>`)

1. Vercel → Project → **Settings → Domains → Add** → enter `demo.outchase.in`
   (replace with your domain).
2. Vercel shows a DNS record to add. In your domain's DNS provider, add:
   - **CNAME** `demo` → `cname.vercel-dns.com`  (recommended), **or** the A/ALIAS
     record Vercel displays.
3. Wait for DNS to verify (usually minutes). Vercel issues HTTPS automatically.
4. Set `NEXT_PUBLIC_APP_URL=https://demo.outchase.in` in Vercel env vars and redeploy
   so link previews (OG image) use the correct absolute URL.
5. Share **`https://demo.outchase.in/demo`** (optionally with `?ref=<campus>` for
   tracking, e.g. `.../demo?ref=raisoni`).

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in real values (demo works without them)
npm run dev                  # http://localhost:3000/demo
```

## Pre-deploy checklist

```bash
npm run build   # must pass with zero TypeScript/lint errors (Vercel fails otherwise)
```
