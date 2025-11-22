import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import ManagerContent from './view';

export default async function ManagerPage() {
  const s = requireRole('Manager');
  if (!s) {
    return (
      <div className="card" style={{ maxWidth: 480, margin: '24px auto' }}>
        <h3>Access restricted</h3>
        <p>Please <Link href="/login">login as Logistics Manager</Link>.</p>
      </div>
    );
  }
  return <ManagerContent />;
}
