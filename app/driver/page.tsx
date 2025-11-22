import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import DriverView from './view';

export default async function DriverPage() {
  const s = requireRole('Driver');
  if (!s) {
    return (
      <div className="card" style={{ maxWidth: 480, margin: '24px auto' }}>
        <h3>Access restricted</h3>
        <p>Please <Link href="/login">login as Driver</Link>.</p>
      </div>
    );
  }
  return <DriverView driverId={s.driverId!} />;
}
