import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protegemos solo '/dashboard' y las subrutas específicas de 'create-story' (no la ruta principal)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/create-story/interactive-stories(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    // Asegurarse de proteger si está en una de las rutas protegidas
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
