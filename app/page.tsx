import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid" style={{ marginTop: 16 }}>
      <div className="card">
        <h2>Manager Dashboard</h2>
        <p>Assign orders, track drivers on the live map, and approve cash collection.</p>
        <Link href="/manager" className="btn primary">Open Dashboard</Link>
      </div>
      <div className="card">
        <h2>Driver App</h2>
        <p>View assigned tasks, update status, and scan barcodes.</p>
        <Link href="/driver" className="btn">Open Driver App</Link>
      </div>
    </div>
  );
}
