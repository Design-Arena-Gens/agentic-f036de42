import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lekya Logistics',
  description: 'Delivery Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #eaeaea' }}>
          <strong>Lekya Logistics</strong>
        </header>
        <main style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>{children}</main>
        <footer style={{ padding: 16, borderTop: '1px solid #eaeaea', marginTop: 24 }}>
          <small>? {new Date().getFullYear()} Lekya Logistics</small>
        </footer>
      </body>
    </html>
  );
}
