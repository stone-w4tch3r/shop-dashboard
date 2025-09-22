import { auth } from '@/lib/mock-auth-server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId } = await auth();

  if (userId === null || userId === undefined || userId === '') {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
