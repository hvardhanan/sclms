import { NextResponse } from 'next/server';
import auth0 from '../lib/auth0';

export async function middleware(request) {
  const session = await auth0.getSession(request);

  if (!session || !session.user) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }

  // Allow the request to proceed if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to specific paths
};
