import { authMiddleware } from '@clerk/nextjs';

// Allow public routes for all paths that don't start with /api or /trpc or /user or /admin
export default authMiddleware({
  publicRoutes: ['/', '/(products|cart|checkout)(.*)'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
