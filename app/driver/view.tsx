"use client";
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const BarcodeScanner = dynamic(() => import('@/components/BarcodeScanner'), { ssr: false });

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Order = {
  id: string; referenceCode: string; customerName: string; address: string; status: string; cashOnDelivery?: number
};

export default function DriverView({ driverId }: { driverId: string }) {
  const { data: orders, mutate } = useSWR<Order[]>(`/api/orders?assignedTo=${driverId}`, fetcher, { refreshInterval: 3000 });
  const [scanResult, setScanResult] = useState<string>('');

  useEffect(() => {
    let watchId: number | null = null;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        fetch('/api/telemetry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ driverId, lat: pos.coords.latitude, lng: pos.coords.longitude }) });
      });
    }
    return () => { if (watchId !== null) navigator.geolocation.clearWatch(watchId); };
  }, [driverId]);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    mutate();
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <h3>My Tasks</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(o => (
              <tr key={o.id}>
                <td>{o.referenceCode}</td>
                <td>{o.customerName}</td>
                <td>{o.address}</td>
                <td><span className="badge">{o.status}</span></td>
                <td className="flex">
                  <button className="btn" onClick={() => updateStatus(o.id, 'ACCEPTED')}>Accept</button>
                  <button className="btn" onClick={() => updateStatus(o.id, 'PICKED_UP')}>Picked Up</button>
                  <button className="btn" onClick={() => updateStatus(o.id, 'IN_TRANSIT')}>In Transit</button>
                  <button className="btn" onClick={() => updateStatus(o.id, 'DELIVERED')}>Delivered</button>
                  <button className="btn" onClick={() => updateStatus(o.id, 'RETURNED')}>Returned</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Scan Barcode</h3>
        <BarcodeScanner onDetected={(text) => setScanResult(text)} />
        {scanResult && <div>Scanned: <strong>{scanResult}</strong></div>}
      </div>
    </div>
  );
}
