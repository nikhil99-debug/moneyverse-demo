import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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

export default clerkMiddleware(async (auth, req) => {
  if (isDemoRoute(req)) return;
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // NOTE: `demo` is excluded so Clerk never runs (no auth handshake/redirect) on the public demo.
    '/((?!_next|demo|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
