import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await verifyAuthSession();
  
  if (session) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}
