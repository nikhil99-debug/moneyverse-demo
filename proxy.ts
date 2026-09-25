import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/xp(.*)',
  '/api/progress(.*)',
  '/api/streak(.*)',
  '/api/leaderboard(.*)',
]);

// The public demo and its embedded modules must NEVER prompt sign-in.
// Short-circuit them before any auth check so the demo stays fully public.
const isDemoRoute = createRouteMatcher(['/demo(.*)', '/demo-modules(.*)']);

// When Clerk isn't configured (a demo-only deploy with no env vars), running
// Clerk would 500 every non-demo route ("Missing publishableKey"). In that mode
// we skip Clerk entirely and send any non-demo request to the public demo, so
// the bare URL lands somewhere useful instead of erroring.
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isDemoRoute(req)) return;
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!clerkConfigured) {
    if (isDemoRoute(req)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = '/demo'; // keep the query string so ?ref= survives a bare-URL share
    return NextResponse.redirect(url);
  }
  return clerkHandler(req, event);
}

export const config = {
  matcher: [
    // NOTE: `demo` is excluded so Clerk never runs (no auth handshake/redirect) on the public demo.
    '/((?!_next|demo|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
