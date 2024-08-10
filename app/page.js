import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Dashboard from './components/Dashboard';

export default async function Page() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/api/auth/login'); // Redirect to login if not authenticated
    return null; // Return null or a placeholder while redirecting
  }

  return (
    <Dashboard/>
  );
}
