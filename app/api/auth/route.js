// app/api/auth/logout/route.js
import auth0 from '../../../lib/auth0';

export async function GET(req) {
  try {
    await auth0.handleLogout(req);
    return new Response(null, {
      status: 302,
      headers: { Location: '/api/auth/logout' },
    });
  } catch (error) {
    return new Response(error.message, { status: error.status || 400 });
  }
}