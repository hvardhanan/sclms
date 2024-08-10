import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || !session.user) {
    // Redirect to login if not authenticated
    redirect('/api/auth/login');
  }

  return (
    <Dashboard/>
  );
}