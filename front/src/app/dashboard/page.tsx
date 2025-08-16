import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  } else {
    // Render a minimal blank dashboard to expose raw layout/nav
    return <div className='p-6' />;
  }
}
