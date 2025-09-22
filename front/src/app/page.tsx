import { auth } from '@/lib/mock-auth-server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { userId } = await auth();

  if (userId === '') {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
