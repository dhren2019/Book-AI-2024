import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Solo protegemos rutas específicas que necesitan autenticación
    '/dashboard(.*)',
    '/create-story/interactive-stories(.*)',
    '/(api|trpc)(.*)',
  ],
};
